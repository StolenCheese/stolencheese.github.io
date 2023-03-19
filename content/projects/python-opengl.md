+++
title = "Python OpenGL"
date = 2019-12-27
[taxonomies]
tags=["python", "opengl"]
[extra]
img= "/projects/python-opengl/demo2.png"
+++

An incredibly cursed python project to render 3D graphics through a TKinter frame.
<!-- more -->
## Results

Instanced rendering allowed for each mesh to be drawn in multiple positions with minimal performance impact. This was very important, because draw calls from _python_ were not the most efficient.
{{gallery(
	images = ["/projects/python-opengl/demo0.png", "/projects/python-opengl/demo1.png","/projects/python-opengl/demo2.png","/projects/python-opengl/demo3.png","/projects/python-opengl/demo4.png","/projects/python-opengl/demo5.png"]
	alts = ["Instanced Rendering", "Skybox","Transparency Ordering","Skybox Reflection","Depth Map","Shadows"]
	)}}

## Core
