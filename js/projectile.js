

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
				}
			}
		}
		
		for(var other of this.collidesWith){
			/*var collisionVector = this.hitbox.getCollisionVector(other.hitbox);
			this.pos.x += collisionVector.x * c.player.bounceSpeed * (timeDiff/1000);
			this.pos.y += collisionVector.y * c.player.bounceSpeed * (timeDiff/1000);*/
		}
		
		if(this.isColliding){
			game.removeProjectile(this);
		}
		
		this.hitbox.moveTo(this.pos);
		
	}
}