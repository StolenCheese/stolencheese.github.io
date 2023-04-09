const messages = ["OilySeal", "MediumMonty", "marmaladesparrow", "SquidgySnakeEgg", "ChickenDe", "Fishsticks 2", "pod monkey", "pipi ike", "firesnipe360", "alchemist864", "wilddog551", "maxdogpax", "atlas"];
const icons = ["revolver", "slingshot", "sawed-off-shotgun", "rope-dart", "oil-can", "panzerfaust", "uzi"];

function create_entry() {

	var audio = new Audio('https://wiki.teamfortress.com/w/images/0/0f/Crit_hit.wav');
	audio.volume = 0.25;
	audio.play();

	const feed_template = document.getElementById('feed-template');
	const entryClone = feed_template.content.cloneNode(true)
	const target = entryClone.querySelector('.red');
	target.textContent = messages[Math.floor(Math.random() * messages.length)];

	const img = entryClone.querySelector('img');
	img.src = "icon/" + icons[Math.floor(Math.random() * icons.length)] + ".svg";

	feed.appendChild(entryClone);

	setTimeout(function () {
		feed.removeChild(feed.childNodes[1]);
	}, 3000);


}
