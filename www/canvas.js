class Sprite {
	constructor(img, s, t, w, h) {
		this.img = img;
		this.s = s;
		this.t = t;
		this.w = w;
		this.h = h;
		this.offset_x = 0;
		this.offset_y = 0;
	}

	set_offset(x, y) {
		this.offset_x = x;
		this.offset_y = y;
		return this;
	}

	toString() {
		return "[Sprite"+ this.s +"]"
	}

	static makeSprite(img_id, s, t, w, h) {
		let img = document.getElementById(img_id);
		return new Sprite(img, s, t, w, g);
	}
}

class SpriteMap {
	constructor(img_id, w, h) {
		this.img = document.getElementById(img_id);
		this.w = w;
		this.h = h;
	}

	getSprite(i, j) {
//		console.log("getSprite("+ i +","+ j +")");

		let s = i * this.w;
		let t = j * this.h;
		let w = this.w;
		let h = this.h;

		return new Sprite(this.img, s, t, w, h).set_offset(-w/2, -h/2);
	}
}

function make_SpriteSeries(img_id, ...sprites) {
	var series = new Array();
	for (let sprite of sprites) {
		console.log(typeof sprite);
		series.push(new Sprite(img_id, sprite[0], sprite[1], sprite[2], sprite[3]));
	}
	return series;
}

class Canvas {
	constructor(canvas_id) {
		this.canvas = document.getElementById(canvas_id);
		this.ctx = this.canvas.getContext("2d");
	}

	set_size(w, h) {
		this.canvas.width = w;
		this.canvas.height = h;
		this.ctx.imageSmoothingEnabled = false;
		return this;
	}

	set_scale(s) {
		this.scale_x = s;
		this.scale_y = s;
		return this;
	}

	draw_sprite(sprite, pos_x, pos_y) {
		var img_x = sprite.s;
		var img_y = sprite.t;
		var img_w = sprite.w;
		var img_h = sprite.h;
		var can_x = Math.floor(pos_x + sprite.offset_x) * this.scale_x;
		var can_y = Math.floor(pos_y + sprite.offset_y) * this.scale_y;
		var can_w = sprite.w * this.scale_x;
		var can_h = sprite.h * this.scale_y;
		this.ctx.drawImage(sprite.img, img_x, img_y, img_w, img_h, can_x, can_y, can_w, can_h);
		return this;
	}

	clear(style) {
		this.ctx.fillStyle = style;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		return this;
	}
}
