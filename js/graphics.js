

function Graphics(game){
	
	var assetPath = "assets/"

	var assets = {
		 drone: {
			path: assetPath + "drone.svg"
		}
		,bot: {
			path: assetPath + "bot.svg"
		}
		,projectile: {
			path: assetPath + "projectile1.svg"
		}
		,fuel: {
			path: assetPath + "fuel.svg"
		}
		,numbers: {
			path: assetPath + "numbers/"
		}
		,scratches: {
			 path: assetPath + "floor/scratch"
			,count: 5
		}
		,splatter: {
			 path: assetPath + "floor/splatter"
			,count: 8
		}
		,cog: {
			 path: assetPath + "debris/cog"
			,count: 7
		}
	};
	
	var world;
	var startScreen = document.getElementById("startScreen");
	var keyboardScreen = document.getElementById("keyboardScreen");
	var droneTemplate;
	var botTemplate;
	var projectileTemplate;
	var fuelTemplate;
	var numberContainerTemplate;
	var numbersTemplates = [];
	
	var width;
	var height;
	
	var canvas;
	var context;
	var fontSize = 36;
	
	var lastSplatter = 0;
	
	var startText = document.getElementById("startText");
	
	console.log(language);
	if(language.isDefault){
		var langs = ["de", "en", "fr", "it"];
		for(var i in langs){
			let startString = document.createElement("span");
			startString.className = "languageScroller";
			startString.style.animationDelay = (-i*4)+"s";
			startString.innerHTML = language.getString("startScreen", langs[i]);
			startText.appendChild(startString);
		}
	} else {
		startText.innerHTML = language.getString("startScreen");
	}
	
	var keyboardText = document.getElementById("keyboardText");
	keyboardText.innerHTML = language.getString("keyboardText");
	var pressOne = document.getElementById("pressOne");
	pressOne.innerHTML = language.getString("pressOne");
	var pressTwo = document.getElementById("pressTwo");
	pressTwo.innerHTML = language.getString("pressTwo");
	var playerOne = document.getElementById("playerOne");
	playerOne.innerHTML = language.getString("playerOne");
	var playerTwo = document.getElementById("playerTwo");
	playerTwo.innerHTML = language.getString("playerTwo");
	
	this.reset = function(){
		world.innerHTML = "";
		floorDecoration.innerHTML = "";
		startScreen.style.display = "none";
	}
	
	this.render = function(){
		if(DEBUG){
			context.clearRect(0, 0, width, height);
			context.font = fontSize+"px monospace";
			context.textAlign = "center";
			context.textBaseline = "middle";
		}
		
		for(var player of game.players){
			if(!player.graphics){
				let element = document.createElement("div");
				element.className = "droneContainer";
				
				let rotateContainer = document.createElement("div");
				element.appendChild(rotateContainer);
				
				if(!player.isBot){
					rotateContainer.innerHTML = droneTemplate;
				} else {
					rotateContainer.innerHTML = botTemplate;
				}
				rotateContainer.style.filter = "hue-rotate("+player.color+"deg)";
				
				player.numbersContainer = rotateContainer.appendChild(document.createElement("div"));
				player.numbersContainer.className = "numbersContainer";
				player.numbersContainer.innerHTML = numbersTemplates[player.points];
					
				player.graphics = element;
				world.appendChild(element);
			}
			
			player.graphics.style.transform = "translate("+player.pos.x+"px, "+player.pos.y+"px)";
			player.graphics.firstChild.style.transform = "rotate("+(player.angle-Math.PI)+"rad)";
			player.numbersContainer.firstChild.style.transform = "rotate("+(-player.angle-Math.PI)+"rad)";
			
			if(DEBUG){
				context.beginPath();
				context.arc(
					player.pos.x,
					player.pos.y,
					player.hitbox.circles.r,
					0,
					2 * Math.PI
				);
				context.strokeStyle = "rgba(0, 0, 0, 1)";
				if(player.isColliding){
					context.fillStyle = "rgba(255, 100, 0, 0.6)";
				} else {
					context.fillStyle = "rgba(0, 255, 0, 0.6)";
				}
				context.fill();
				context.stroke();
				
				context.fillStyle = "rgba(0, 0, 0, 1.0)";
				context.fillText(player.points, player.pos.x+2, player.pos.y+2);
				context.fillStyle = "rgba(255, 255, 255, 1.0)";
				context.fillText(player.points, player.pos.x, player.pos.y);
			}
		}
		
		for(var projectile of game.projectiles){
			if(!projectile.graphics){
				let element = document.createElement("div");
				element.className = "projectileContainer";
				element.style.filter = "hue-rotate("+projectile.player.color+"deg)";
					
				let rotateContainer = document.createElement("div");
				element.appendChild(rotateContainer);
				
				rotateContainer.innerHTML = droneTemplate;
				
				rotateContainer.innerHTML = projectileTemplate;
					
				projectile.graphics = element;
				world.appendChild(element);
			}
			
			projectile.graphics.style.transform = "translate("+projectile.pos.x+"px, "+projectile.pos.y+"px)";
			//projectile.graphics.firstChild.firstChild.style.transform = "rotate("+(projectile.angle-Math.PI)+"rad)";
			
			if(DEBUG){
				context.beginPath();
				context.arc(
					projectile.pos.x,
					projectile.pos.y,
					projectile.hitbox.circles.r,
					0,
					2 * Math.PI
				);
				context.strokeStyle = "rgba(0, 0, 0, 1)";
				if(projectile.isColliding){
					context.fillStyle = "rgba(255, 255, 0, 0.6)";
				} else {
					context.fillStyle = "rgba(0, 255, 255, 0.6)";
				}
				context.fill();
				context.stroke();
			}
		}
		
		for(var fuel of game.fuels){
			if(!fuel.graphics){
				let element = document.createElement("div");
				element.className = "fuelContainer";
				element.innerHTML = fuelTemplate;
					
				fuel.graphics = element;
				world.appendChild(element);
			}
			
			fuel.graphics.style.transform = "translate("+fuel.pos.x+"px, "+fuel.pos.y+"px)";
			//fuel.graphics.firstChild.style.transform = "rotate("+(fuel.angle-Math.PI)+"rad)";
			
			if(DEBUG){
				context.beginPath();
				context.arc(
					fuel.pos.x,
					fuel.pos.y,
					fuel.hitbox.circles.r,
					0,
					2 * Math.PI
				);
				context.strokeStyle = "rgba(0, 0, 0, 1)";
				if(fuel.isColliding){
					context.fillStyle = "rgba(255, 0, 0, 0.6)";
				} else {
					context.fillStyle = "rgba(255, 0, 255, 0.6)";
				}
				context.fill();
				context.stroke();
			}
		}
	}
	
	this.updatePlayerPoints = function(player){
		player.numbersContainer.innerHTML = numbersTemplates[player.points];
	}
	
	this.removeEntity = function(entity){
		if(entity.graphics && world.contains(entity.graphics) &&(!game.gameEnded)){
			world.removeChild(entity.graphics);
			return entity;
		}
	}
	
	this.decorateFloor = function(){
		var count = 50;
		
		for(var i = 0; i < count; i++){
			var c = i % assets.scratches.count;
			
			var scratch = document.createElement("img");
			scratch.src = assets.scratches.path + c + ".svg";
			scratch.className = "scratch";
			scratch.width = Math.random() * 70 + 30;
			scratch.style.top = (Math.random()*height)+"px";
			scratch.style.left = (Math.random()*width)+"px";
			scratch.style.transform = "rotate("+(Math.random()*360)+"deg)";
			scratch.style.opacity = Math.random()*0.3+0.2;
			floor.appendChild(scratch);
		}
	}	
	
	this.init = function(){
		world = document.getElementById("world");
		background = document.getElementById("background");
		floor = document.getElementById("floor");
		floorDecoration = document.getElementById("decoration");
		
		width = world.clientWidth;
		height = world.clientHeight;
		
		if(DEBUG){
			canvas = document.getElementById("debugCanvas");
			canvas.height = height;
			canvas.width = width;
			context = canvas.getContext("2d");
		}

		droneTemplate = document.createElement("img");
		droneTemplate.src = assets.drone.path;
		droneTemplate.className = "drone";
		droneTemplate.width = c.graphics.playerWidth;
		droneTemplate.style.marginTop = (-c.graphics.playerHeight/2)+"px";
		droneTemplate.style.marginLeft = (-c.graphics.playerWidth/2)+"px";
		let tempContainer = document.createElement("div");
		tempContainer.appendChild(droneTemplate);
		droneTemplate = tempContainer.innerHTML;
		
		botTemplate = document.createElement("img");
		botTemplate.src = assets.bot.path;
		botTemplate.className = "drone";
		botTemplate.width = c.graphics.playerWidth;
		botTemplate.style.marginTop = (-c.graphics.playerHeight/2)+"px";
		botTemplate.style.marginLeft = (-c.graphics.playerWidth/2)+"px";
		tempContainer = document.createElement("div");
		tempContainer.appendChild(botTemplate);
		botTemplate = tempContainer.innerHTML;

		projectileTemplate = document.createElement("img");
		projectileTemplate.src = assets.projectile.path;
		projectileTemplate.className = "projectile";
		projectileTemplate.width = c.graphics.projectileDiameter;
		projectileTemplate.style.marginTop = (-c.graphics.projectileDiameter/2)+"px";
		projectileTemplate.style.marginLeft = (-c.graphics.projectileDiameter/2)+"px";
		tempContainer = document.createElement("div");
		tempContainer.appendChild(projectileTemplate);
		projectileTemplate = tempContainer.innerHTML;
		
		numberContainerTemplate = document.createElement("div");
		numberContainerTemplate.className = "numberContainer";
		tempContainer = document.createElement("div");
		tempContainer.appendChild(numberContainerTemplate);
		numberContainerTemplate = tempContainer.innerHTML;

		fuelTemplate = document.createElement("img");
		fuelTemplate.src = assets.fuel.path;
		fuelTemplate.className = "fuel";
		fuelTemplate.width = c.graphics.fuelWidth;
		fuelTemplate.style.marginTop = (-c.graphics.fuelHeight/2)+"px";
		fuelTemplate.style.marginLeft = (-c.graphics.fuelWidth/2)+"px";
		tempContainer = document.createElement("div");
		tempContainer.appendChild(fuelTemplate);
		fuelTemplate = tempContainer.innerHTML;
		
		
		var numberTemplate = document.createElement("img");
		numberTemplate.className = "number";
		
		for(var i = 0; i <= 9; i++){
			numberTemplate.src = assets.numbers.path + i + ".svg";
			tempContainer = document.createElement("div");
			tempContainer.appendChild(numberTemplate);
			numbersTemplates[i] = tempContainer.innerHTML;
		}
		
		this.decorateFloor();
	}
	
	this.playBatteryHitAnimation = function(pos){
		var element = document.createElement("div");
		element.className = "batteryHit";
		element.style.top = pos.y+"px";
		element.style.left = pos.x+"px";
		world.appendChild(element);
		setTimeout(function(){
			world.removeChild(element);
		}.bind(this), 400)
	}
	
	this.addOilSplatter = function(pos){
		var splatter = document.createElement("img");
		splatter.src = assets.splatter.path + lastSplatter + ".svg";
		splatter.className = "splatter";
		splatter.width = Math.random() * 40 + 60;
		splatter.style.transform = "translate("+(pos.x - splatter.width/2)+"px, "+(pos.y - splatter.width/2)+"px) rotate("+(Math.random()*360)+"deg)";
		splatter.style.transform = "translate("+(pos.x - splatter.width/2)+"px, "+(pos.y - splatter.width/2)+"px) rotate("+(Math.random()*360)+"deg)";
		splatter.style.opacity = Math.random()*0.5+0.2;
		floorDecoration.appendChild(splatter);
		
		lastSplatter = (lastSplatter + 1) % assets.splatter.count;
	}
	
	this.playPlayerHitAnimation = function(player){
		player.graphics.className += " hit";
		this.addOilSplatter(player.pos);
		setTimeout(function(){
			player.graphics.className = "droneContainer";
		}.bind(player), 100);
	}
	
	this.addFlyingDebris = function(pos){
		
		var splatters = 3;
		while(splatters--){
			this.addOilSplatter(pos);
		}
		
		var count = 10;
		
		while(count--){
			var c = count % assets.cog.count;
			
			var debrisContainer = document.createElement("div");
			debrisContainer.className = "debrisContainer";
			debrisContainer.style.transform = "rotate("+(Math.random()*360)+"deg)";
			debrisContainer.style.top = pos.y+"px"
			debrisContainer.style.left = pos.x+"px";
			
			var debris = document.createElement("img");
			debris.src = assets.cog.path + c + ".svg";
			debris.className = "debris";
			debris.width = Math.random() * 30 + 10;
			debris.style.animationDuration = (Math.random()*300+300)+"ms";
			debris.style.filter = "brightness("+(20+Math.random()*60)+"%)";
			
			debrisContainer.appendChild(debris);
			floorDecoration.appendChild(debrisContainer);
		}
	}
	
	
	this.initConfetti = function(parent){
		var confettiCount = 30;
		
		while(confettiCount--){
			var c = confettiCount % assets.cog.count;
			
			var confetti = document.createElement("img");
			confetti.src = assets.cog.path + c + ".svg";
			confetti.className = "confetti";
			confetti.width = Math.random() * 40 + 20;
			confetti.style.top = (-confetti.width)+"px"
			confetti.style.left = (Math.random()*width)+"px";
			confetti.style.animationDelay = (-Math.random()*3)+"s";
			confetti.style.animationDuration = (Math.random()*1+3)+"s";
			confetti.style.filter = "brightness("+(20+Math.random()*60)+"%)";
			parent.appendChild(confetti);
		}
	}
	
	this.playVictoryAnimation = function(winner){
		var overlay = document.createElement("div")
		overlay.id ="victoryOverlay";
		overlay.innerHTML = 
		'<div>\
			<span>'+language.getString("winner")+'</span>\
			<span class="pressStart">'+language.getString("endScreen")+'</span>\
		</div>';
		overlay.style.filter = "hue-rotate("+winner.color+"deg)";
		world.appendChild(overlay);
		winner.graphics.style.transition = "transform";
		winner.graphics.style.transitionDuration = "2s";
		winner.graphics.style.transitionTimingFunction = "ease-in-out";
		
		
		setTimeout(function(){			
			for(var child of world.childNodes){
				if(child != winner.graphics && child != overlay){
					world.removeChild(child);
				}
			}
			
			this.initConfetti(overlay);
			
			overlay.style.opacity = 1;
			
			winner.graphics.style.transform = "translate("+(width/2)+"px, "+(height/2-c.graphics.playerHeight/2)+"px) scale(2)";
				
		}.bind(this), 100);
	}
	
	this.showStartScreen = function(){
		startScreen.style.display = "block";
	}
	
	this.showKeyboardScreen = function(){
		keyboardScreen.style.display = "block";
	}
	
	this.hideKeyboardScreen = function(){
		keyboardScreen.style.display = "none";
	}

	this.init();
	
}