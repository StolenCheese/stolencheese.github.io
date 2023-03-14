+++
title = "Python OpenGL"
date = 2019-12-27
+++

An incredibly cursed python project to render 3D graphics through a TKinter frame.
<!-- more -->
## Results

Instanced rendering allowed for each mesh to be drawn in multiple positions with minimal performance impact. This was very important, because draw calls from _python_ were not the most efficient.

![Instanced Rendering](/projects/python-opengl/demo0.png)
![Skybox](/projects/python-opengl/demo1.png)
![Transparency Ordering](/projects/python-opengl/demo2.png)
![Skybox Reflection](/projects/python-opengl/demo3.png)
![Depth Map](/projects/python-opengl/demo4.png)
![Shadows](/projects/python-opengl/demo5.png)
