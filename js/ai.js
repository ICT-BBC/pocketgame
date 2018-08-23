
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
	
	game.createPlayerFromAI(this.controller);
	
	var timeLast = performance.now();
	var lastActionTime = 0;
	var nextActionTimeout = Math.random()*1000 + 300;
	//var nextActionTimeout = 100;
	
	this.step = function(){
		var timeNow = performance.now();
		var timeDiff = timeNow - timeLast;
		timeLast = timeNow;
		
		var actionTimeDiff = timeNow - lastActionTime;
		
		if(actionTimeDiff > nextActionTimeout){
			lastActionTime = performance.now();
			nextActionTimeout = Math.random()*1000 + 300;
			
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