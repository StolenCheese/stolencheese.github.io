+++
title = "Armere"
date = 2020-05-21
description="All of my hobby projects up until 2022 in one big bundle."
[taxonomies]
tags=["games", "cs"]
[extra]
repo = "https://github.com/pettett/Armere"
img="/projects/armere/grass.png"
+++

All of my hobby projects up until 2022 in one big bundle. <!-- more --> This was my main introduction to large codebases, to this day I think it went pretty well all things considered, and it certainly taught me a huge amount about organisation, making code that I can actually read, got me to start using vscode, and how to use git (or at least the github desktop app).

Communications between different projects (mechanics) are structured through event driven dependency injection, using Unity's scriptable objects acting as event delegates (Mechanics/ScriptableObjects/EventChannels). Examples of these are connecting the enemy death event to spawning interact-able items, or connecting the player's sword swing to destroying blades of grass.

![Waterfall](/projects/armere/waterfall.png)

## Grass

![Grass](/projects/armere/grass.png)

This grass I remember absolutely killing me when I first made it. Inspired in no small part by a certain open world switch game. Before the explanation, have some progress images:

{{gallery(
	images = ["/projects/armere/grass-0.png","/projects/armere/grass-1.png","/projects/armere/grass-2.png","/projects/armere/grass-3.png"]
	alts = ["First working indirect render" ,"First working lit shader (with shadows)", "Density based distribution", "Player interaction"]
)}}

Using draw instanced indirect functionality, I have been able to (after many attempts) create a system to place blades of grass on height mapped terrain, using local terrain data such as splatmaps to inform how the grass should be created.

![Grass Chunking system](/projects/armere/grass_chunks.png)

A chunk system is used stored as a quad-tree to enable quick loading and unloading of grass blades, represented as blocks of GPU memory.

Grass blades can also be destroyed using compute shaders, for example the destroy grass in bounds event channel will mark every blade of grass in the bounds as dead, then while rendering, a prefix parallel sum pass is performed to pack all living blades into a separate buffer for rendering.

## Volumetrics

![Volumetrics](/projects/armere/volumetric.jpg)

A post processing effect for the URP pipeline, added to the pipeline as a 'Render Feature'.

The effect created world space volumetric lighting for beams cast from the main directional light in the scene, based on a low resolution ray march through the scene depth map and the sun's shadow map to measure total transmission to the camera, although it was not physically based.

## Cel Shading

![Cel Shader](/projects/armere/cel.png)

Similar inspiration to the grass, a cel shader for NPCs and the player character. A mostly standard Blinn–Phong shader with the addition of toon like ramping and a rim highlighting fresnel, with support for many engine features such as cubemapped reflections (also rendered into cel) and ambient occlusion.

## Gameplay

The `playercontroller` system is state driven and has a lot of functionality, including running Yarn dialogue during any "interactions" triggered, and full movement including swimming and climbing (on specific vine walls) The player is attached to it's inventory and quest book for item and goal usage.

The NPCs follow routines based on the time of day, and each store there own inventory locally, allowing for any NPC to engage in trade if the dialogue command is triggered.

The save load system and game constructor are used to save game state directly into binary, although eventually this will use the messagepack format.

Enemies and Animals use a similar state based system as the `playercontroller` to perform (at the moment very basic) activities.

## Physics

### Buoyancy

![Buoyant cylinder](/projects/armere/log_in_water.png)

The buoyancy system uses the voxel approach to sample discrete cubes within a physics object for how much water they displace and
so how much force and torque should be enacted on the object. This is done in parallel, also using Unity Burst allowing for very fast execution.

### Trees

![Tree chop](/projects/armere/tree_chop.png)

Chopping down trees creates dynamic tree meshes as the trunks have cuts marked into them and are eventually felled.

Chops reveal the rings inside the tree by using a separate texture and material for tris created inside the trunk.
This is also done in parallel using burst resulting in very quick performance.

## Water

Swimming in water creates a particle effect that leaves ripples behind the player. Any items entering or exiting water create their own splashes and ripples.

![Water Trail](/projects/armere/water_trail.png)
