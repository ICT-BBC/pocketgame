

/*
	pos: {x, y}
		in canvas pixels
*/

function Fuel(game, pos){
	this.pos = pos;
	this.colliding = false;
	this.hitbox = new Hitbox(
		new Circle(
			 c.graphics.fuelHeight/2
			,this.pos.x
			,this.pos.y
		)
	);
	
	/*var timeLast = performance.now();
		
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
		
		if(this.isColliding){
			game.removeProjectile(this);
		}
		
		this.hitbox.moveTo(this.pos);
		
	}*/
}