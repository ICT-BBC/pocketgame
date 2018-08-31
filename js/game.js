
var DEBUG = false;

var c = {
	 player: {
		 speed: 200 //pixels per second
		,bounceSpeed: 205 // force pushing outwards while intersecting with other player
		,controllerDeadzone: 0.4
		,minPoints: 1
		,maxPoints: 9
		,startingPoints: 5
	}
	,projectile: {
		 speed: 700
		,timeout: 500 // ms between shots
	}
	,fuel: {
		 chancePerSecond: 0.3 // chance of one fuel appearing, kinda
		,maxCount: 10 // maximum number of fuels on screen at one time
		,padding: 50 // minimum possible distance to window edge
	}
	,graphics: {
		 playerWidth: 100
		,playerHeight: 120
		,projectileDiameter: 30
		,projectileHitboxDiameter: 26
		,fuelWidth: 20
		,fuelHeight: 35
	}
};

var game = new Game();

function Game(){
	
	this.players = [];
	this.deadPlayers = [];
	this.projectiles = [];
	this.fuels = [];
	this.ais = [];
	
	this.animationFrame = null;
	this.gameEnded = true;
	
	var world = document.getElementById("world");
	var height = world.clientHeight;
	var width = world.clientWidth;
	
	this.walls = new Walls(width, height);
	
	this.graphics = new Graphics(this);
	this.input = new Input();
	
	this.controllerInput = new ControllerInput();
	
	var timeLast = performance.now();
	
	this.startGame = function(){
		/*this.players.push(
			new Player(
				 this
				,{
					 x: Math.random()*width
					,y: Math.random()*height
				}
				,c.player.startingPoints
				,0
				,new Controller(
					this.input
					,{
						 up: "KeyW"
						,down: "KeyS"
						,right: "KeyD"
						,left: "KeyA"
						,shoot: "KeyF"
						,start: "KeyE"
					}
				)
			)
		);
		
		this.players.push(
			new Player(
				 this
				,{
					 x: Math.random()*width
					,y: Math.random()*height
				}
				,c.player.startingPoints
				,0
				,new Controller(
					this.input
					,{
						 up: "ArrowUp"
						,down: "ArrowDown"
						,right: "ArrowRight"
						,left: "ArrowLeft"
						,shoot: "Numpad0"
						,start: "Numpad1"
					}
				)
			)
		);*/
		
		for(let oldPlayer of this.deadPlayers){
			var player = new Player(
				 this
				,{
					 x: Math.random()*width
					,y: Math.random()*height
				}
				,c.player.startingPoints
				,0
				,oldPlayer.controller
			);
			oldPlayer.controller.player = player;
			this.players.push(player);
		}
		this.deadPlayers = [];
		
		var aiCount = Math.max(0, 2 - this.players.length);
		for(var i = 0; i < aiCount; i++){
			this.createAI();
		}
		
		this.graphics.reset();
		this.gameEnded = false;
		timeLast = performance.now();
		this.loop();
	}
	
	this.resetGame = function(){
		for(let oldPlayer of this.deadPlayers){
			if(!oldPlayer.isBot){
				var player = new Player(
					 this
					,{
						 x: Math.random()*width
						,y: Math.random()*height
					}
					,c.player.startingPoints
					,0
					,oldPlayer.controller
				);
				oldPlayer.controller.player = player;
				player.color = oldPlayer.color;
				this.players.push(player);
			}
		}
		this.deadPlayers = [];
		this.projectiles = [];
		for(var i in this.fuels){
			this.fuels[i].isAlive = false;
		}
		
		var aiCount = Math.max(0, 2 - this.players.length);
		for(var i = 0; i < aiCount; i++){
			this.createAI();
		}
		
		this.fuels = [];
		this.graphics.reset();
		console.log(this.players);
		this.addRandomFuel();
		this.loop();
	}
	
	this.loop = function(){
		this.logicStep();
		this.graphicsStep();
		if(!this.gameEnded){
			this.animationFrame = requestAnimationFrame(this.loop.bind(this));
			//setTimeout(this.loop.bind(this), 100);
		}
	};
	
	this.endScreenLoop = function(){
		for(let player of this.deadPlayers){
			if(player.controller.getControls().start){
				this.gameEnded = false;
				this.resetGame();
			}
		}
		if(this.gameEnded){
			requestAnimationFrame(this.endScreenLoop.bind(this));
		}
	};
	
	this.startScreenLoop = function(){
		for(let player of this.deadPlayers){
			if(player.controller.getControls().start){
				this.gameEnded = false;
				this.startGame();
			}
		}
		if(this.gameEnded){
			requestAnimationFrame(this.startScreenLoop.bind(this));
		}
	};
	
	
	this.endGame = function(){
		window.cancelAnimationFrame(this.animationFrame);
		this.gameEnded = true;
		
		for(let player of this.players){
			this.deadPlayers.push(player);
		}
		this.ais = [];
		this.players = [];
		this.endScreenLoop();
		//setTimeout(this.resetGame.bind(this), 3000);
	}
	
	this.logicStep = function(){
		
		if(this.players.length <= 1){
			if(this.players[0]){
				var winner = this.players[0];
				this.graphics.playVictoryAnimation(winner);
				this.endGame();
			}
		}
		
		var timeNow = performance.now();
		var timeDiff = timeNow - timeLast;
		timeLast = timeNow;
		
		if(this.fuels.length < c.fuel.maxCount && Math.random() < timeDiff * ((c.fuel.chancePerSecond/1000)/this.fuels.length)){
			this.addRandomFuel();
		}
		
		for(var player of this.players){
			player.step();
		}
		
		for(var projectile of this.projectiles){
			projectile.step();
		}
		
		for(var fuel of this.fuels){
			fuel.step();
		}
		
		for(var ai of this.ais){
			ai.step();
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
			,c.player.startingPoints
			,0
			,pad
		);
		if(this.gameEnded){
			this.deadPlayers.push(player);
		} else {
			this.players.push(player);
		}
		
		return player;
	};
	
	this.createPlayerFromAI = function(controller){
		var player = new Player(
			 this
			,{
				 x: Math.random()*width
				,y: Math.random()*height
			}
			,c.player.startingPoints
			,0
			,controller
		);
		this.players.push(player);
		
		return player;
	};
	
	this.removePlayer = function(player){
		player.isAlive = false;
		this.deadPlayers.push(player);
		this.graphics.removeEntity(player);
		for(var i = 0; i < this.players.length; i++){
			if(this.players[i] == player){
				this.players.splice(i, 1);
				return i;
			}
		}
	};
	
	this.disconnectPlayer = function(player){
		player.isAlive = false;
		this.graphics.removeEntity(player);
		for(var i = 0; i < this.players.length; i++){
			if(this.players[i] == player){
				this.players.splice(i, 1);
				return i;
			}
		}
		for(var i = 0; i < this.deadPlayers.length; i++){
			if(this.deadPlayers[i] == player){
				this.deadPlayers.splice(i, 1);
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
		fuel.isAlive = false;
		this.graphics.playBatteryHitAnimation(fuel.pos);
		this.graphics.removeEntity(fuel);
		for(var i = 0; i < this.fuels.length; i++){
			if(this.fuels[i] == fuel){
				this.fuels.splice(i, 1);
				return i;
			}
		}
	};
	
	this.createAI = function(){
		this.ais.push(new BullyAI(this));
	}
	
	this.startScreenLoop();
	//this.startGame();
	
}
