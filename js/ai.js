
function AI(game){
	
	this.keys = {
		 up: false
		,down: false
		,right: false
		,left: false
		,shoot: false
	};
	
	this.controller = new Controller(
		this
		,{
			 up: "up"
			,down: "down"
			,right: "right"
			,left: "left"
			,shoot: "shoot"
		}
	)
	
	this.player = game.createPlayerFromAI(this.controller);
	this.player.isBot = true;
	
	this.timeLast = performance.now();
	this.lastActionTime = 0;
	this.nextActionTimeout = Math.random()*1000 + 300;
	//var nextActionTimeout = 100;
	
	this.step = function(){}
	
}

function DumbAI(game){
	AI.call(this, game);
	
	this.step = function(){
		this.timeNow = performance.now();
		var timeDiff = this.timeNow - this.timeLast;
		this.timeLast = this.timeNow;
		
		var actionTimeDiff = this.timeNow - this.lastActionTime;
		
		if(actionTimeDiff > this.nextActionTimeout){
			this.lastActionTime = performance.now();
			this.nextActionTimeout = Math.random()*1000 + 300;
			
			for(var i in this.keys){
				if(Math.random() > 0.5){
					this.keys[i] = true;
				} else {
					this.keys[i] = false;
				}
			}
		}
	}
}

function BullyAI(game){
	AI.call(this, game);
	
	this.target = null;
	
	this.findTarget = function(){
		if(game.players.length > 1){
			do{
				this.target = game.players[~~(Math.random()*game.players.length)];
			} while (this.target == this.player);
		}
	}
	
	this.findTarget();
	
	this.step = function(){
		
		if(!this.target || !this.target.isAlive){
			this.findTarget();
		}
		
		this.timeNow = performance.now();
		var timeDiff = this.timeNow - this.timeLast;
		this.timeLast = this.timeNow;
		
		
		var distX = this.target.pos.x - this.player.pos.x;
		var distY = this.target.pos.y - this.player.pos.y;
		
		for(var i in this.keys){
			this.keys[i] = false;
		}
		
		if(Math.abs(distX) < Math.abs(distY)){
			if(Math.abs(distX) <= 20){
				if(distY < 0){
					this.keys.up = true;
				} else {
					this.keys.down = true;
				}
				this.keys.shoot = true;
			} else {			
				if(distX < 0){
					this.keys.left = true;
				} else {
					this.keys.right = true;
				}
			}
		} else {
			if(Math.abs(distY) <= 20){
				if(distX < 0){
					this.keys.left = true;
				} else {
					this.keys.right = true;
				}
				this.keys.shoot = true;
			} else {	
				if(distY < 0){
					this.keys.up = true;
				} else {
					this.keys.down = true;
				}
			}
		}
		
		
		/*var actionTimeDiff = this.timeNow - this.lastActionTime;
		
		if(actionTimeDiff > this.nextActionTimeout){
			this.lastActionTime = performance.now();
			this.nextActionTimeout = Math.random()*1000 + 300;
			
			for(var i in this.keys){
				if(Math.random() > 0.5){
					this.keys[i] = true;
				} else {
					this.keys[i] = false;
				}
			}
		}*/
	}
}