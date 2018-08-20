

function Hitbox(circles){
	this.circles = circles;
	
	this.intersects = function(other){
		return this.circles.intersects(other.circles);
	}
	
	this.getCollisionVector = function(other){
		return this.circles.getCollisionVector(other.circles);
	}
	
	this.moveTo = function(pos){
		this.circles.x = pos.x;
		this.circles.y = pos.y;
		return this;
	}
}

/*function Rectangle(h, w, x, y){
	
	this.h = h;
	this.w = w;
	this.x = x;
	this.y = y;
	
	this.intersects = function(rect){
		
		return (
			   this.x - this.w/2 > rect.x + rect.w/2
			&& this.x + this.w/2 < rect.x - rect.w/2
			&& this.y - this.h/2 > rect.y + rect.h/2
			&& this.y + this.h/2 < rect.y - rect.h/2
		);
		
	}
	
	// returns vector pointing away from other rectangle
	this.getCollisionVector = function(rect){
		var vect = new Vector(
			 this.x - rect.x
			,this.y - rect.y
		).normalise();
	}
}*/

function Circle(r, x, y){
	
	this.r = r
	this.x = x;
	this.y = y;
	
	this.intersects = function(other){
		
		return (
			new Vector(this.x - other.x, this.y - other.y).getLength() < (this.r + other.r)
		);
		
	}
	
	// returns vector pointing away from other circle
	this.getCollisionVector = function(other){
		return vect = new Vector(
			 this.x - other.x
			,this.y - other.y
		).normalise();
	}
}
