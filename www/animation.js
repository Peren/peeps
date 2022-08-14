var Animate = (function() {
/*
class State {
	constructor(name, count) {
		this.name = name;
		this.frame = 0;
		this.count = count;
	}
}
*/
class Animation {
	constructor(name, config) {
		this.name = name;
		this.config = config;
		this.frame = 0;
		this.time = 0;
	}

	update(now) {
//		console.log(this.name +" "+ this.frame);
		this.time = now;
		this.frame = (this.frame + 1) % this.config.framecount;
	}

	getimage() {
		return {};
	}
}

function xinit() {
	console.log("Animate::init");
	Animate.create("A", {framecount:10});
}

function xrender(now) {
//	console.log("Animate::render"+ now + xanimations.length);
	xanimations.forEach(function(animation) {
		animation.update(now);
		animation.getimage();
//		console.log(animation);
	});
}

var xanimations = new Array();

return {
	init: function() {
		return xinit();
	},
	render: function(now) {
		return xrender(now);
	},
	create: function(name, config) {
		var animation = new Animation(name, config);
		xanimations.push(animation);
		return animation;
	}
};

})();

$(document).ready(function() {
	Animate.init();
});

window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function( callback ) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

//var then;

(function animloop(now) {
//	if (!then) { then = now; }
	requestAnimFrame(animloop);
//	delta = now - then;
	Animate.render(now);
})();
