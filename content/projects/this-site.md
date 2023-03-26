+++
title = "This Website"
date = 2023-03-13
[extra]
repo = "https://github.com/maxwell-gm206/maxwell-gm206.github.io"
site = "https://maxwell-gm206.github.io"
img =  "/projects/meta.png"
style="main"
+++

This website is built off [Zola](https://github.com/getzola/zola), a very neat rust based static site generator that allows me to be writing this text in markdown, and separating the job of making the html and css into something I have to do later. <!-- more --> If I ever want to add css at all that is, there is definitely something very nostalgic about blank websites. Not great for phone use though.

It's hosted on github pages, as seen by the `.github.io` in the url, which is one of the many very developer friendly tools github provides that I still struggle to believe have been allowed to exist given Microsoft's _spotless_ track record[^1]. Html elements can be inserted to text, using shortcodes[^demos]

## Demos

I can insert shortcodes in the markdown to embed custom html, for example this banner:

{{banner(src="/thoughts/here.png")}}

Or this quote

{% quote(author="Maxwell")%}
I think this is pretty neat
{% end %}

Or this gallery of images:

{{gallery(
	images = ["/renders/enceladus-3.png", "/renders/enceladus-wide.png", "/projects/armere/grass.png", "/projects/camgamjam/trophy.png", "/renders/trangeir.png"],
	alts = ["Winter holidays by shuttle to Enceladus", "Spaceport overview", "Grass", "Trophy", "Trangeir"])
}}

---

[^1]: [see](https://en.wikipedia.org/wiki/Criticism_of_Microsoft)
