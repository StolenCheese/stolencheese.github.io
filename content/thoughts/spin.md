+++
title = "Webgl Engine"
date = 2023-04-15
template = "webgl.html" 
+++

Wooooooo

{%webgl()%}
let data= [
	#{
		type:"water",
		reflectivity: 0.5,
		fresnel_strength: 1.5,
		wave_speed: 0.06,
		use_reflection: true,
		use_refraction: true,
	},
	#{
		type : "mesh",
		position : [0,0,0],
		mesh : "/webgl/models/Forklift.glb"
	},
];
return data;
{%end%}
