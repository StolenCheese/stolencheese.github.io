+++
title = "Factorio Mod: Concentrated Solar Power"
date = 2022-12-13
[taxonomies]
tags=["games", "lua", "blender"]
[extra]
repo = "https://github.com/StolenCheese/ch-concentrated-solar"
site = "https://mods.factorio.com/mod/ch-concentrated-solar"
img = "/projects/banner2.png"
+++

A Factorio mod I made over the christmas holiday, currently sitting at 809 downloads (!).
<!-- more -->

<img src="https://mods.factorio.com/opengraph/mod/ch-concentrated-solar.png" alt= "Mod Opengraph Information Embed"  height="200px">

I'm quite happy with the power output as it stands at the default though, it was always intended as an improvement to solar rather then a nuclear power competitor, and if it were to take up the exact space as nuclear while still being about to work 24/7, as well as how energy dense steam storage can be, I think it would quickly become very unbalanced (see the other existing concentrated solar mod).

The reason solar intensity was set at 600 however was to limit the range on heat pipes, to incentivise close heat exchangers pumping steam to turbines further away, as a bit of a spacing puzzle.

{{banner(src="/projects/banner2.png")}}

## Inner Workings + Experience with the Mod API

### Main Functions

Every modded item in Factorio has to be derived from an existing "prototype", a definition of an entity with a set of parameters set when the game loads, and with a special purpose in the game processing loop; a `light` prototype has some light property that determines how it will illuminate the world, for example.

Towers use the `reactor` prototype definition, as the only one in the game to generate heat from a power source. The contents/burning fuel of the reactor is a custom fluid named `solar-intensity`, the the amount of power generated scaling based on its temperature, allowing the power of a tower to be scaled easily by the number of surrounding mirrors, just by setting their temperature. The main downside of this is that in Factorio 0°≠ empty, despite both producing no power, so the tower's fluid box must be explicitly drained during night/with no surrounding mirrors to display the no fuel icon.

The main loop of the mod is then as such:

```lua
local function on_nth_tick_tower_update(event)

	-- Place fluid in towers

	if not global.tower_mirrors[global.last_updated_tower] then
		global.last_updated_tower = nil
	end
    -- Update towers incrementally, to spread cost of computation across many frames
	for i = 1, global.tower_update_count or 1, 1 do

		global.last_updated_tower = next(global.tower_mirrors, global.last_updated_tower)

		if global.last_updated_tower then
			local tid = global.last_updated_tower
			local mirrors = global.tower_mirrors[tid]

			-- Attempt to update tower {tid} (it may no longer exist)

			local tower = global.towers[tid]

			if tower and tower.valid then 
                -- Get the amount of sun currently on a 0-1 scale
                -- identical to how solar panels calculate it
				local sun = control_util.calc_sun(tower.surface)

				tower.clear_fluid_inside()

				if sun > 0 and table_size(mirrors) > 0 then
					local amount = control_util.fluidTempPerMirror * sun * table_size(mirrors)
					-- set to temperature and amount, as fluid turrets cannot display temperature
					tower.insert_fluid {
						name        = control_util.mod_prefix .. "solar-fluid",
						amount      = amount,
						temperature = amount
					}
				end
			else
				control_util.notify_tower_invalid(tid)
			end
		end
	end
end
```

Key to this is maintaining the table `global.tower_mirrors`, which is a map between tower ids `tid` and an array of mirror entities, which proved to be very annoying. But doable, eventually.

First task was tracking down which events were called when creating and destroying entities, which turned out to be, for destroying:

- `defines.events.on_pre_player_mined_item`
- `defines.events.on_robot_pre_mined`
- `defines.events.on_entity_died`
- `defines.events.script_raised_destroy`

And for creating:

- `defines.events.on_built_entity`
- `defines.events.on_robot_built_entity`
- `defines.events.script_raised_built` (event carries `entity` instead of `created_entity`)
- `defines.events.script_raised_revive` (same as above)

When placing a tower or a mirror, we ask the game for every prototype in a `radius` square around them, and perform the relevant linkings.

Mirrors are simple; if there are no towers in range, do nothing, one tower in range, link to it, or multiple towers in range, link to the closest and store the
others in range locally.

Towers are a little more complex, but effectively obey the same rules for linking as mirrors, just from the other direction, and with enough trial and error this was working too.

The complexities start to arise when destroying entities. Mirrors simply remove themselves from their tower's link, but removing a tower requires going through every mirror, removing itself as it's closest, and linking it to the mirror's next closest tower (which is why we store other towers in range during creation- without this, destroying a tower created a large lag spike as each mirror searched from scratch for towers in range).

### Beams

{{figure(src = "/projects/ch-concentrated-solar/beams.png" alt="Beams" caption = "First working beam graphics")}}

With power generation working, beams where quite simple to implement; a certain number of mirrors where identified as beam sources, and had a beam entity spawned between them and a point near the top of the tower (not exactly the top to add variation). This was calculated based on a simple hash of the `mid`, and beams were linked to mirrors so destruction was simple.

To make beams phase in over the day/night cycle, this process is repeated once every 600 ticks for all towers (incrementally, the same as the update routine above), and the hash was extended to allow a range of mirrors to produce beams, but lower hash numbers meant the beam was more prevalent throughout the day.

Beams are spawned with a lifetime of 600 ticks in the `generateBeam` method, to ensure they do not pile up and eventually crash the game (which did happen before I noticed this bug).

The core of the loop then, minus the incremental tower logic (effectively the same as the main loop code):

```lua
-- Start spawning beams for the day

local stage = math.floor(control_util.calc_sun(tower.surface) * control_util.sun_stages) - 1

-- max possible time a beam could live for, to account for possible errors
local ttl = math.abs(tower.surface.evening - tower.surface.dawn) * tower.surface.ticks_per_day

--game.print("New sun stage " .. stage .. " with life of " .. ttl)
for mid, mirror in pairs(global.tower_mirrors[global.last_updated_tower_beam]) do
    -- Can only spawn sun rays on mirrors with towers

    local group = (mid * 29) % control_util.mirror_groups

    if group <= stage and global.mirror_tower[mid].beam == nil then
        -- at this point, we don't need to worry about the old beams, as they have been destroyed
        global.mirror_tower[mid].beam = control_util.generateBeam
            {
                mirror = mirror,
                tower = tower,
                ttl = ttl
            }
    elseif group > stage and global.mirror_tower[mid].beam then
        global.mirror_tower[mid].beam.destroy()
        global.mirror_tower[mid].beam = nil
    end
end

```

The `mid` is multiplied by the prime 29 to give some randomness to beam placements, as entity indexes are assigned incrementally, so spawning based on just them clustered to beams (an effect that I actually liked, but was shot down by testers)

### Overlay

{{figure(src = "/projects/ch-concentrated-solar/overlay.png" alt="Overlay" caption = "Early placement overlay")}}

Turned out very easy to implement, as the game has very similar functionality for electrical systems - in the `defines.events.on_player_cursor_stack_changed` or `defines.events.on_selected_entity_changed`, check if the entity or stack in question is related to your system (in this case a tower or a mirror), and spawn bounding boxes for each important range-based entity (in this case, just towers).
