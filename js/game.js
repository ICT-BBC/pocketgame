

var c = {
	player: {
		 speed: 200 //pixels per second
		,controllerDeadzone: 0.4
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
			if(this.players[i] == player){
				this.players.splice(i, 1);
				return i;
			}
		}
	};
	
	this.loop();
	
}
