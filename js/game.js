

var c = {
	player: {
		 speed: 200 //pixels per second
	}
};

var game = new Game();

function Game(){
	
	this.players = [];
	
	var canvas = document.getElementById("renderCanvas");
	var canvasContainer = document.getElementById("canvasContainer");
	
	var height = ~~(canvasContainer.clientHeight);
	var width = ~~(canvasContainer.clientWidth);

	canvas.height = height;
	canvas.width = width;
	
	this.graphics = new Graphics(this, canvas, canvasContainer);
	this.input = new Input();
	
	this.controllerInput = new ControllerInput();
	
	this.players.push(
		new Player(
			{
				 x: Math.random()*canvas.width
				,y: Math.random()*canvas.height
			}
			,5
			,0
			,new Controller(
				this.input
				,{
					 up: "KeyW"
					,down: "KeyS"
					,right: "KeyD"
					,left: "KeyA"
				}
			)
		)
	);
	
	this.players.push(
		new Player(
			{
				 x: Math.random()*canvas.width
				,y: Math.random()*canvas.height
			}
			,5
			,0
			,new Controller(
				this.input
				,{
					 up: "ArrowUp"
					,down: "ArrowDown"
					,right: "ArrowRight"
					,left: "ArrowLeft"
				}
			)
		)
	);
	
	this.loop = function(){
		this.logicStep();
		this.graphicsStep();
		requestAnimationFrame(this.loop.bind(this));
	};
	
	this.logicStep = function(){
		for(var player of this.players){
			player.step();
		}
	};
	
	this.graphicsStep = function(){
		this.graphics.render();
	};
	
	this.createPlayerFromGamepad = function(pad){
		var player = new Player(
			{
				 x: Math.random()*canvas.width
				,y: Math.random()*canvas.height
			}
			,5
			,0
			,pad
		);
		this.players.push(player);
		
		return player;
	};
	
	this.removePlayer = function(player){
		for(var i = 0; i < this.players.length; i++){
			console.log(this.players[i], player);
			if(this.players[i] == player){
				this.players.splice(i, 1);
				return i;
			}
		}
	};
	
	this.loop();
	
}

function Graphics(game, canvas, canvasContainer){
	var context = canvas.getContext("2d");

	this.render = function(){
		context.clearRect(0, 0, canvas.width, canvas.height);
		for(var player of game.players){
			context.beginPath();
			context.arc(
				player.pos.x,
				player.pos.y,
				20,
				0,
				2 * Math.PI
			);
			context.moveTo(
				 player.pos.x + Math.sin(player.angle)*7
				,player.pos.y - Math.cos(player.angle)*7
			);
			
			context.lineTo(
				 player.pos.x + Math.sin(player.angle)*27
				,player.pos.y - Math.cos(player.angle)*27
			);
			context.lineWidth = 3;
			context.fillStyle = player.color;
			context.fill();
			context.stroke();
		}
	}
}

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
		
		this.isMoving = (Math.abs(controls.x) > 0.5 || Math.abs(controls.y) > 0.5);
		
		if(this.isMoving){
			
			this.angle = Math.atan2(controls.x, -controls.y);
			
			
			this.pos.x += Math.sin(this.angle)*movementDist;
			this.pos.y -= Math.cos(this.angle)*movementDist;
		}
		
	}
}

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
		console.log("connect "+id);
		
		var padObject = new Gamepad(pad);
		padObject.player = game.createPlayerFromGamepad(padObject);
		this.controllers[id] = padObject;
	}.bind(this));
	
	window.addEventListener("gamepaddisconnected", function(e){
		//console.log(e);
		var pad = e.gamepad;
		var id = pad.index;
		console.log("disconn "+id);
		
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
		
		return {
			 x: x
			,y: y
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
		
		return {
			 x: x
			,y: y
		};
	};
}

function colorHash(inputString){
	inputString = "seed"+inputString;
	var sum = 0;
	
	for(var i in inputString){
		sum += inputString.charCodeAt(i);
	}

	r = ~~(('0.'+Math.sin(sum+1).toString().substr(6))*256);
	g = ~~(('0.'+Math.sin(sum+2).toString().substr(6))*256);
	b = ~~(('0.'+Math.sin(sum+3).toString().substr(6))*256);

	var rgb = "rgb("+r+", "+g+", "+b+")";

	var hex = "#";

	hex += ("00" + r.toString(16)).substr(-2,2).toUpperCase();
	hex += ("00" + g.toString(18)).substr(-2,2).toUpperCase();
	hex += ("00" + b.toString(20)).substr(-2,2).toUpperCase();

	return {
		 r: r
		,g: g
		,b: b
		,rgb: rgb
		,hex: hex
	};
}