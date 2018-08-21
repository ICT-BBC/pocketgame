
var DEBUG = false;

var c = {
	 player: {
		 speed: 200 //pixels per second
		,bounceSpeed: 105 // force pushing outwards while intersecting with other player
		,controllerDeadzone: 0.4
	}
	,projectile: {
		 speed: 500
		,timeout: 700 // ms between shots
	}
	,graphics: {
		 playerWidth: 60
		,playerHeight: 69
		,projectileDiameter: 30
		,projectileHitboxDiameter: 26
	}
};

var game = new Game();

function Game(){
	
	this.players = [];
	this.projectiles = [];
	
	/*var canvas = document.getElementById("renderCanvas");
	var canvasContainer = document.getElementById("canvasContainer");
	
	var height = ~~(canvasContainer.clientHeight);
	var width = ~~(canvasContainer.clientWidth);

	canvas.height = height;
	canvas.width = width;*/
	
	var world = document.getElementById("world");
	var height = world.clientHeight;
	var width = world.clientWidth;
	
	this.graphics = new Graphics(this);
	this.input = new Input();
	
	this.controllerInput = new ControllerInput();
	
	this.players.push(
		new Player(
			 this
			,{
				 x: 200
				,y: 200
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
					,shoot: "KeyF"
				}
			)
		)
	);
	
	this.players.push(
		new Player(
			 this
			,{
				 x: 200.05
				,y: 200.05
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
					,shoot: "Key0"
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
		
		for(var projectile of this.projectiles){
			projectile.step();
		}
	};
	
	this.graphicsStep = function(){
		this.graphics.render();
	};
	
	this.createPlayerFromGamepad = function(pad){
		var player = new Player(
			 this
			,{
				 x: Math.random()*width
				,y: Math.random()*height
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
	
	this.addProjectile = function(player){
		var projectile = new Projectile(
			 this
			,player
			,{x: player.pos.x, y: player.pos.y}
			,player.angle
		);
		this.projectiles.push(projectile);
		
		return projectile;
	};
	
	this.removeProjectile = function(projectile){
		this.graphics.removeEntity(projectile);
		for(var i = 0; i < this.projectiles.length; i++){
			if(this.projectiles[i] == projectile){
				this.projectiles.splice(i, 1);
				return i;
			}
		}
	};
	
	this.loop();
	
}
