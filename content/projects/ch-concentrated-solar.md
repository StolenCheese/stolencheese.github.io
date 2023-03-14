+++
title = "Factorio Mod: Concentrated Solar Power"
date = 2022-12-13
[extra]
repo = "https://github.com/StolenCheese/ch-concentrated-solar"
site = "https://mods.factorio.com/mod/ch-concentrated-solar"
img = "/projects/banner2.png"
+++

A Factorio mod I made over the christmas holiday, currently sitting at 809 downloads (!).
<!-- more -->

<!-- {{factorio_mod_embed(mod="ch-concentrated-solar")}} -->

I'm quite happy with the power output as it stands at the default though, it was always intended as an improvement to solar rather then a nuclear power competitor, and if it were to take up the exact space as nuclear while still being about to work 24/7, as well as how energy dense steam storage can be, I think it would quickly become very unbalanced (see the other existing concentrated solar mod).

The reason solar intensity was set at 600 however was to limit the range on heat pipes, to incentivise close heat exchangers pumping steam to turbines further away, as a bit of a spacing puzzle.

{{banner(src="/projects/banner2.png")}}

## Mod Description

This mod adds concentrated solar power to Factorio, in two components:

- **Heliostat Mirrors** - Mirrors that rotate to beam 1.1°C of solar intensity to the closest tower within their range of 35 tiles.
- **Solar Towers**, which consume solar intensity:
	- The Solar Power Tower, which turns solar energy into up to 60MW of heat.
	- The Solar Laser Tower, which concentrates solar energy into up to 60MW of solar devastation.

### Performance

Most work is done on building placement and deletion, then each group of a single tower and all it's mirrors are updated at once, making this quite performant. For UPS oriented megabases this is clearly not the way for the same reason as nuclear power; fluid.

### Mod Compatibility

#### K2

- Power buff to 110MW
- Researched after advanced solar panels
- Tweaked crafting recipes (included glass, lithium-chloride, etc.)

#### Space Exploration

- Towers can be placed in space
- Requires space science packs
- K2+SE support to merge tech changes
