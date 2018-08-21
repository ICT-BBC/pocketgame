
var DEBUG = true;

var c = {
	 player: {
		 speed: 200 //pixels per second
		,bounceSpeed: 105 // force pushing outwards while intersecting with other player
		,controllerDeadzone: 0.4
		,minPoints: 0
		,maxPoints: 9
	}
	,projectile: {
		 speed: 500
		,timeout: 700 // ms between shots
	}
	,fuel: {
		 chancePerSecond: 0.1 // chance of one fuel appearing 
		,maxCount: 10 // maximum number of fuels on screen at one time
		,padding: 50 // minimum possible distance to window edge
	}
	,graphics: {
		 playerWidth: 60
		,playerHeight: 69
		,projectileDiameter: 30
		,projectileHitboxDiameter: 26
		,fuelWidth: 20
		,fuelHeight: 35
	}
};

var game = new Game();

function Game(){
	
	this.players = [];
	this.projectiles = [];
	this.fuels = [];
	
	/*var canvas = document.getElementById("renderCanvas");
	var canvasContainer = document.getElementById("canvasContainer");
	
	var height = ~~(canvasContainer.clientHeight);
	var width = ~~(canvasContainer.clientWidth);

	canvas.height = height;
	canvas.width = width;*/
	
	var world = document.getElementById("world");
	var height = world.clientHeight;
	var width = world.clientWidth;
	
	this.walls = new Walls(width, height);
	
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
					,shoot: "Numpad0"
				}
			)
		)
	);
	
	this.loop = function(){
		this.logicStep();
		this.graphicsStep();
		requestAnimationFrame(this.loop.bind(this));
	};
	
	var timeLast = performance.now();
	
	this.logicStep = function(){
		
		var timeNow = performance.now();
		var timeDiff = timeNow - timeLast;
		timeLast = timeNow;
		
		if(this.fuels.length < c.fuel.maxCount && Math.random() < timeDiff * (c.fuel.chancePerSecond/1000)){
			this.addRandomFuel();
		}
		
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
		this.graphics.removeEntity(player);
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
	
	this.addRandomFuel = function(){
		var pos = {
			 x: Math.random() * (width-2*c.fuel.padding) + c.fuel.padding
			,y: Math.random() * (height-2*c.fuel.padding) + c.fuel.padding
		};
		return this.addFuel(pos);
	}
	
	this.addFuel = function(pos){
		var fuel = new Fuel(
			 this
			,pos
		);
		this.fuels.push(fuel);
		
		return fuel;
	};
	
	this.removeFuel = function(fuel){
		this.graphics.removeEntity(fuel);
		for(var i = 0; i < this.fuels.length; i++){
			if(this.fuels[i] == fuel){
				this.fuels.splice(i, 1);
				return i;
			}
		}
	};
	
	this.addRandomFuel();
	
	this.loop();
	
}
