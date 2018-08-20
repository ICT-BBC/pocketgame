

function Vector(x, y){
	this.x = x;
	this.y = y;
	
	this.getLength = function(){
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}
	
	this.normalise = function(){
		return new Vector(this.x/this.getLength(), this.y/this.getLength());
	}
	
}