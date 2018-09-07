

/*
	pos: {x, y}
		in canvas pixels
	points: int
	angle: radians
*/

Player.nextColor = 0;

function Player(game, pos, points, angle, controller){
	this.pos = pos;
	this.points = points;
	this.angle = angle;
	this.controller = controller;
	this.isMoving = false;
	
	this.color = Player.nextColor;
	Player.nextColor += 137.5/2;
	this.isAlive = true;
	this.isBot = false;
	this.colliding = false;
	this.hitbox = new Hitbox(
		new Circle(
			 c.graphics.playerWidth/2
			,this.pos.x
			,this.pos.y
		)
	);
	
	var timeLast = performance.now();
	var lastShotTime = 0;
		
	this.step = function(){
		var timeNow = performance.now();
		var timeDiff = timeNow - timeLast;
		timeLast = timeNow;
		
		this.color += timeDiff/10;
		
		var movementDist = (c.player.speed + 100 - Math.sqrt(this.points/9)*130) * (timeDiff/1000);
		var controls = this.controller.getControls();
		
		this.isMoving = (
			   Math.abs(controls.x) > c.player.controllerDeadzone
			|| Math.abs(controls.y) > c.player.controllerDeadzone
		);
		
		if(this.isMoving){
			this.angle = Math.atan2(controls.x, -controls.y);
			
			this.pos.x += Math.sin(this.angle)*movementDist;
			this.pos.y -= Math.cos(this.angle)*movementDist;
		}
		
		this.hitbox.moveTo(this.pos);
		
		this.collidesWith = [];
		this.isColliding = false;
		for(var other of game.players){
			if(other != this){
				if(this.hitbox.intersects(other.hitbox)){
					this.isColliding = true;
					this.collidesWith.push(other);
				}
			}
		}
		
		for(var other of this.collidesWith){
			var collisionVector = this.hitbox.getCollisionVector(other.hitbox);
			this.pos.x += collisionVector.x * c.player.bounceSpeed * (timeDiff/1000);
			this.pos.y += collisionVector.y * c.player.bounceSpeed * (timeDiff/1000);
		}
		
		if(game.walls.intersects(this.hitbox.circles)){
			this.isColliding = true;
			
			var collisionVector = game.walls.getCollisionVector(this.hitbox.circles);
			this.pos.x += collisionVector.x * c.player.speed * (timeDiff/1000);
			this.pos.y += collisionVector.y * c.player.speed * (timeDiff/1000);
		}
		
		var timeSinceLastShot = timeNow - lastShotTime;
		if(controls.shoot && timeSinceLastShot >= c.projectile.timeout){
			game.addProjectile(this);
			lastShotTime = timeNow;
		}
		
	}
	
	this.increasePoints = function(){
		if(this.points < c.player.maxPoints){
			this.points++;
			game.graphics.updatePlayerPoints(this);
		}
	}
	
	this.decreasePoints = function(){
		if(this.points > c.player.minPoints){
			this.points--;
			game.graphics.updatePlayerPoints(this);
			game.graphics.playPlayerHitAnimation(this);
		} else {
			game.removePlayer(this);
		}
	}
}