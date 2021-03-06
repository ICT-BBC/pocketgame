

/*
	pos: {x, y}
		in canvas pixels
	angle: radians
*/

function Projectile(game, player, pos, angle){
	this.pos = pos;
	this.player = player;
	this.angle = angle;
	this.colliding = false;
	this.hitbox = new Hitbox(
		new Circle(
			 c.graphics.projectileHitboxDiameter/2
			,this.pos.x
			,this.pos.y
		)
	);
	
	var timeLast = performance.now();
		
	this.step = function(){
		var timeNow = performance.now();
		var timeDiff = timeNow - timeLast;
		timeLast = timeNow;
		
		var movementDist = c.projectile.speed * (timeDiff/1000);
		
		this.pos.x += Math.sin(this.angle)*movementDist;
		this.pos.y -= Math.cos(this.angle)*movementDist;
		
		this.collidesWith = [];
		this.isColliding = false;
		for(var other of game.players){
			if(other != this.player){
				if(this.hitbox.intersects(other.hitbox)){
					this.isColliding = true;
					this.collidesWith.push(other);
					other.decreasePoints();
				}
			}
		}
		
		for(var other of game.fuels){
			if(this.hitbox.intersects(other.hitbox)){
				this.isColliding = true;
				this.collidesWith.push(other);
				game.removeFuel(other);
				this.player.increasePoints();
			}
		}
		
		if(game.walls.intersects(this.hitbox.circles)){
			this.isColliding = true;
		}
		
		if(this.isColliding){
			game.removeProjectile(this);
		}
		
		this.hitbox.moveTo(this.pos);
		
	}
}