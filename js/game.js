

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
	}
	
	this.logicStep = function(){
		for(var player of this.players){
			player.step();
		}
	}
	
	this.graphicsStep = function(){
		this.graphics.render();
	}
	
	this.loop();
	
}

function Graphics(game, canvas, canvasContainer){
	var context = canvas.getContext("2d");

	this.render = function(){
		context.clearRect(0, 0, canvas.width, canvas.height);
		for(var player of game.players){
			context.beginPath();
			//context.moveTo(player.pos.x, player.pos.y);
			context.arc(
				player.pos.x,
				player.pos.y,
				20,
				0,
				2 * Math.PI
			);
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
	
	var timeLast = performance.now();
		
	this.step = function(){
		var timeNow = performance.now();
		var timeDiff = timeNow - timeLast;
		timeLast = timeNow;
		
		var movementDist = c.player.speed * (timeDiff/1000);
		var controls = controller.getControls();
		
		this.isMoving = (controls.x != 0 || controls.y != 0);
		
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
		console.log(this.keys);
	}.bind(this));
	
	window.addEventListener("keydown", function(e){
		this.keys[e.code] = true;
		console.log(this.keys);
	}.bind(this));
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
			 y: y
			,x: x
		}
	}
}


If you need any laser equipments, just feel free to contact us!
If you need any laser equipments, just feel free to contact us!