

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
	
	var timeLast = performance.now();
		
	this.step = function(){
		var timeNow = performance.now();
		var timeDiff = timeNow - timeLast;
		timeLast = timeNow;
		
		this.hitbox.moveTo(this.pos);
		
		this.collidesWith = [];
		this.isColliding = false;
		for(var other of game.players){
			if(this.hitbox.intersects(other.hitbox)){
				this.isColliding = true;
				this.collidesWith.push(other);
			}
		}
		
		for(var other of game.fuels){
			if(other != this){
				if(this.hitbox.intersects(other.hitbox)){
					this.isColliding = true;
					this.collidesWith.push(other);
				}
			}
		}
		
		for(var other of this.collidesWith){
			var collisionVector = this.hitbox.getCollisionVector(other.hitbox);
			this.pos.x += collisionVector.x * c.player.bounceSpeed*2 * (timeDiff/1000);
			this.pos.y += collisionVector.y * c.player.bounceSpeed*2 * (timeDiff/1000);
		}
		
		if(game.walls.intersects(this.hitbox.circles)){
			this.isColliding = true;
			
			var collisionVector = game.walls.getCollisionVector(this.hitbox.circles);
			this.pos.x += collisionVector.x * c.player.speed * (timeDiff/1000);
			this.pos.y += collisionVector.y * c.player.speed * (timeDiff/1000);
		}
		
	}
}