+++
title = "Webgl Engine"
date = 2023-04-15
template = "webgl.html" 
[taxonomies]
tags=["rust", "rendering"]
[extra]
repo = "https://github.com/pettett/rs-embedded-micro-webgl2-engine"
+++

A small rust based webgl2 renderer.

<!-- more -->
{%webgl()%}
let data= [
	#{
		type : "mesh",
		position : [0,-30,0],
		scale: [10,10,10],
		mesh : "assets/models/Sponza.gltf",
	},
	#{
		type:"water",
		reflectivity: 0.5,
		fresnel_strength: 1.5,
		wave_speed: 0.06,
		use_reflection: true,
		use_refraction: true,
	},
];
return data;
{%end%}
