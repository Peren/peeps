class Entity {
	constructor(state, pos_x, pos_y) {
		this.state = state;
		this.pos_x = pos_x;
		this.pos_y = pos_y;
	}

	update(world) {
		this.state.update(this, world);
	}

	render(canvas, sprite_map) {
		let sprite = this.state.getSprite(sprite_map);
		canvas.draw_sprite(sprite, this.pos_x, this.pos_y);
	}
}

class Peep extends Entity {
	constructor(name, world) {
		super(new EntityState_Init(world), 0, 0);
		this.name = name;
	}

	update(world) {
		super.update(world);
	}
}

class EntityState {
	constructor(name, world) {
		this.name = name;
	}

	update(entity, world) {
	}

	getSprite(sprite_map) {
		return sprite_map.getSprite(0, 0);
	}

	toString() {
		return this.name;
	}
}

class EntityState_Init extends EntityState {
	constructor(world) {
		super("Init", world);
	}

	update(entity, world) {
		let h_v = Math.random() > 0.5;
		entity.pos_x = (h_v ? Math.random() : Math.round(Math.random()))*world.pos_x_max;
		entity.pos_y = (h_v ? Math.round(Math.random()) : Math.random())*world.pos_y_max;
		entity.state = new EntityState_Idle(world);
	}
}

class EntityState_Idle extends EntityState {
	constructor(world) {
		super("Idle", world);
		this.delay = (Math.random() * 2);
	}

	update(entity, world) {
		if ((this.delay -= world.dt) < 0) {
			if (entity.pos_x < 0 || entity.pos_x > world.pos_x_max ||
				entity.pos_y < 0 || entity.pos_y > world.pos_y_max) {
				entity.state = new EntityState_Warp(world);
			} else {
				entity.state = new EntityState_Walk(world);
			}
		}
	}

	getSprite(sprite_map) {
		let n = Math.floor(this.delay*6) % 4;
		let m = 4;
		return sprite_map.getSprite(n, m);
	}
}

class EntityState_Walk extends EntityState {
	constructor(world) {
		super("Walk", world);
		this.delay = (Math.random() * 5);
		this.dx = 0;
		this.dy = 0;
	}

	update(entity, world) {
		if (this.dx == 0 && this.dy == 0) {
			var dx = Math.random()*world.pos_x_max - entity.pos_x;
			var dy = Math.random()*world.pos_y_max - entity.pos_y;
			var dir = Math.atan2(dy, dx);
			this.dx = Math.cos(dir)*16;
			this.dy = Math.sin(dir)*16;
		}

		entity.pos_x += (this.dx * world.dt);
		entity.pos_y += (this.dy * world.dt);

		if (entity.pos_x < -10 || entity.pos_x > world.pos_x_max +10 ||
			entity.pos_y < -10 || entity.pos_y > world.pos_y_max +10) {
			entity.state = new EntityState_Warp(world);
		}

		if ((this.delay -= world.dt) < 0) {
			entity.state = new EntityState_Idle(world);
		}
	}

	getSprite(sprite_map) {
		let n = Math.floor(this.delay*6) % 4;
		let m = (Math.abs(this.dx) > Math.abs(this.dy)) ?
			(this.dx > 0 ? 0 : 1) :
			(this.dy < 0 ? 2 : 3);

		return sprite_map.getSprite(n, m);
	}
}

class EntityState_Warp extends EntityState {
	constructor(world) {
		super("Warp", world);
		this.delay = (Math.random() * 10);

		let h_v = Math.random() > 0.5;
		this.pos_x = ( h_v ? Math.random() : Math.round(Math.random()))*world.pos_x_max;
		this.pos_y = (!h_v ? Math.random() : Math.round(Math.random()))*world.pos_y_max;

//		this.pos_x = world.pos_x_max/2;
//		this.pos_y = world.pos_y_max/2;
	}

	update(entity, world) {
		if ((this.delay -= world.dt) < 0) {
			entity.pos_x = this.pos_x;
			entity.pos_y = this.pos_y;
			entity.state = new EntityState_Idle(this.world);
		}
	}

	getSprite(sprite_map) {
		let n = Math.floor(this.delay*6) % 4;
		let m = 4;
		return sprite_map.getSprite(n, m);
	}
}

class World {
	constructor(x_max, y_max) {
		this.dt = 0;
		this.peeps = new Array();
		this.peeps_index_x = this.peeps.splice(0);
		this.peeps_index_y = this.peeps.splice(0);

		this.pos_x_max = x_max;
		this.pos_y_max = y_max;
	}

	update(now) {
		if (!this.then) {
			this.then = now;
			return;
		}
		this.dt = (now - this.then)/1000;
		this.peeps_index_x = this.peeps.slice(0);
		this.peeps_index_y = this.peeps.slice(0);

		for (let peep of this.peeps) {
			peep.update(this);
		}

		this.peeps_index_x.sort(function(p1, p2) { return p1.pos_x - p2.pos_x; });
		this.peeps_index_y.sort(function(p1, p2) { return p1.pos_y - p2.pos_y; });

		this.then = now;
	}

	render(canvas, sprite_map) {
		canvas.clear("#3f7f3f");

		for (let peep of this.peeps_index_y) {
			peep.render(canvas, sprite_map);
		}
	}

	add_peep(peep) {
		this.peeps.push(peep);
	}
}

class Game {
	constructor(world) {
		this.state = new GameState_Running();
		this.world = world;
	}
	update() {
		this.state.update(this);
	}
}

class GameState {
	constructor() {}
	update(game) {}
}

class GameState_Paused extends GameState {
	constructor() {}
	update(game) {}
}

class GameState_Running extends GameState {
	constructor() {}
	update(game) {}
}

var PeepSprites;
var PeepCanvas;
var world;

$(document).ready(function() {
	PeepCanvas = new Canvas("PeepCanvas").set_size(320, 240).set_scale(2);
	PeepSprites = new SpriteMap("PeepImage", 16, 16);

	world = new World(160, 120);
	for (let i = 0; i < 100; ++i) {
		let peep = "P"+ i;
		world.add_peep(new Peep(peep, world));
	}

	world.update();
	world.render(PeepCanvas, PeepSprites);
});

(function animloop(now) {
	requestAnimFrame(animloop);

	if (!world) return;

	world.update(now);
	world.render(PeepCanvas, PeepSprites);
})();
