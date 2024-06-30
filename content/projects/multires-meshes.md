+++
title = "Multiresolution Meshes: Rendering One Billion Triangles"
date = 2024-05-26
[taxonomies]
tags=["rust"]
[extra]
style="monokai"
img = "/projects/meshes/figure6.png"
repo="https://github.com/pettett/multires"
+++

My dissertation for the final year of my course, scoring 11th place and awarded the "Highly Commended Part II Dissertation" prize. <br/>
The title is a misnomer; I achieved rendering scenes up to 200 billion triangles strong.

<!-- more -->

I researched multiresolution meshes, meshes that allow varying their resolution across their surface, a technology previously implemented in Unreal Engine 5's Nanite.
My solution contained highly optimised GPU code for 2 algorithms, defined and discussed within the dissertation.
The lack of current public research in this topic required me to develop these algorithms myself, with results rivalling the state of the art.
The submitted pdf is available [here](/projects/meshes/main.pdf) (until Typst supports exporting to html).

At the roughly mid way point, I submitted my work to the CESCG student research seminar. I travelled to the conference in Slovakia to deliver my work, winning prizes for 2nd best presentation and 3rd best research paper.
![Smolenice Castle](/projects/meshes/thumbnail.jpg)
The paper is published in its proceedings [here](https://cescg.org/cescg_submission/multiresolution-mesh-rendering-engine-implementation-practicalities-and-performance/).
