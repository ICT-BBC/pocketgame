

function Input(){
	this.keys = {};
	
	window.addEventListener("keyup", function(e){
		this.keys[e.code] = false;
	}.bind(this));
	
	window.addEventListener("keydown", function(e){
		this.keys[e.code] = true;
	}.bind(this));
}

function ControllerInput(){
	this.controllers = [];
	
	window.addEventListener("gamepadconnected", function(e){
		//console.log(e);
		var pad = e.gamepad;
		var id = pad.index;
		//console.log("connect "+id);
		
		var padObject = new Gamepad(pad);
		padObject.player = game.createPlayerFromGamepad(padObject);
		this.controllers[id] = padObject;
	}.bind(this));
	
	window.addEventListener("gamepaddisconnected", function(e){
		//console.log(e);
		var pad = e.gamepad;
		var id = pad.index;
		//console.log("disconn "+id);
		
		game.removePlayer(this.controllers[id].player);
		this.controllers[id] = null;
	}.bind(this));
}

function Gamepad(pad){
	this.player = null;
	this.pad = pad;
	
	this.getControls = function(){
		
		this.pad = navigator.getGamepads()[pad.index];
		
		var x = pad.axes[0];
		var y = pad.axes[1];
		var shoot = pad.buttons[0].pressed;
		var start = pad.buttons[9].pressed;
		
		return {
			 x: x
			,y: y
			,shoot: shoot
			,start: start
		};
	};
}

function Controller(input, keys){
	this.getControls = function(){
		var y = 0;
		if(input.keys[keys.up]){
			y--;
		}
		if(input.keys[keys.down]){
			y++;
		}
		
		var x = 0;
		if(input.keys[keys.left]){
			x--;
		}
		if(input.keys[keys.right]){
			x++;
		}
		
		var shoot = input.keys[keys.shoot];
		var start = input.keys[keys.start];
		
		return {
			 x: x
			,y: y
			,shoot: shoot
			,start: start
		};
	};
}