

/*
	pos: {x, y}
		in canvas pixels
	points: int
	angle: radians
*/

function Player(pos, points, angle, controller){
	this.pos = pos;
	this.points = points;
	this.angle = angle;
	this.isMoving = false;
	this.color = colorHash(Math.random()+"").hex;
	
	var timeLast = performance.now();
		
	this.step = function(){
		var timeNow = performance.now();
		var timeDiff = timeNow - timeLast;
		timeLast = timeNow;
		
		var movementDist = c.player.speed * (timeDiff/1000);
		var controls = controller.getControls();
		
		this.isMoving = (
			   Math.abs(controls.x) > c.player.controllerDeadzone
			|| Math.abs(controls.y) > c.player.controllerDeadzone
		);
		
		if(this.isMoving){
			this.angle = Math.atan2(controls.x, -controls.y);
			
			this.pos.x += Math.sin(this.angle)*movementDist;
			this.pos.y -= Math.cos(this.angle)*movementDist;
		}
		
	}
}