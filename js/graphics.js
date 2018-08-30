

function Graphics(game){
	
	var assetPath = "assets/"

	var assets = {
		drone: {
			path: assetPath + "drone.svg"
		},
		bot: {
			path: assetPath + "bot.svg"
		},
		projectile: {
			path: assetPath + "projectile1.svg"
		},
		fuel: {
			path: assetPath + "fuel.svg"
		},
		numbers: {
			path: assetPath + "numbers/"
		}
	};
	
	var world;
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
	
	init();
	
	this.reset = function(){
		world.innerHTML = "";
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
			
			player.graphics.style.top = player.pos.y + "px";
			player.graphics.style.left = player.pos.x + "px";
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
			
			projectile.graphics.style.top = projectile.pos.y + "px";
			projectile.graphics.style.left = projectile.pos.x + "px";
			projectile.graphics.firstChild.firstChild.style.transform = "rotate("+(projectile.angle-Math.PI)+"rad)";
			
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
			
			fuel.graphics.style.top = fuel.pos.y + "px";
			fuel.graphics.style.left = fuel.pos.x + "px";
			fuel.graphics.firstChild.style.transform = "rotate("+(fuel.angle-Math.PI)+"rad)";
			
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
	
	
	function init(){
		world = document.getElementById("world");
		background = document.getElementById("background");
		floor = document.getElementById("floor");
		//floor.style.backgroundImage = "url("+assets.background.path+")";
		
		width = world.clientWidth;
		height = world.clientHeight;
		
		if(DEBUG){
			canvas = document.createElement("canvas");
			canvas.id = "debugCanvas";
			canvas.height = height;
			canvas.width = width;
			context = canvas.getContext("2d");
			
			world.appendChild(canvas);
		}

		droneTemplate = document.createElement("object");
		droneTemplate.type = "image/svg+xml";
		droneTemplate.data = assets.drone.path;
		droneTemplate.className = "drone";
		droneTemplate.width = c.graphics.playerWidth;
		droneTemplate.style.marginTop = (-c.graphics.playerHeight/2)+"px";
		droneTemplate.style.marginLeft = (-c.graphics.playerWidth/2)+"px";
		let tempContainer = document.createElement("div");
		tempContainer.appendChild(droneTemplate);
		droneTemplate = tempContainer.innerHTML;
		
		botTemplate = document.createElement("object");
		botTemplate.type = "image/svg+xml";
		botTemplate.data = assets.bot.path;
		botTemplate.className = "drone";
		botTemplate.width = c.graphics.playerWidth;
		botTemplate.style.marginTop = (-c.graphics.playerHeight/2)+"px";
		botTemplate.style.marginLeft = (-c.graphics.playerWidth/2)+"px";
		tempContainer = document.createElement("div");
		tempContainer.appendChild(botTemplate);
		botTemplate = tempContainer.innerHTML;

		projectileTemplate = document.createElement("object");
		projectileTemplate.type = "image/svg+xml";
		projectileTemplate.data = assets.projectile.path;
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

		fuelTemplate = document.createElement("object");
		fuelTemplate.type = "image/svg+xml";
		fuelTemplate.data = assets.fuel.path;
		fuelTemplate.className = "fuel";
		fuelTemplate.width = c.graphics.fuelWidth;
		fuelTemplate.style.marginTop = (-c.graphics.fuelHeight/2)+"px";
		fuelTemplate.style.marginLeft = (-c.graphics.fuelWidth/2)+"px";
		tempContainer = document.createElement("div");
		tempContainer.appendChild(fuelTemplate);
		fuelTemplate = tempContainer.innerHTML;
		
		
		var numberTemplate = document.createElement("object");
		numberTemplate.type = "image/svg+xml";
		numberTemplate.className = "number";
		//numberTemplate.width = c.graphics.numberWidth;
		//numberTemplate.style.marginTop = (-c.graphics.numberHeight/2)+"px";
		//numberTemplate.style.marginLeft = (-c.graphics.numberWidth/2)+"px";
		
		for(var i = 0; i <= 9; i++){
			numberTemplate.data = assets.numbers.path + i + ".svg";
			tempContainer = document.createElement("div");
			tempContainer.appendChild(numberTemplate);
			numbersTemplates[i] = tempContainer.innerHTML;
		}
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
	
	this.playVictoryAnimation = function(winner){
		console.log("bort");
		var overlay = document.createElement("div")
		overlay.id ="victoryOverlay";
		overlay.innerHTML = 
		'<div>\
			<span>Winner!</span>\
			<span class="pressStart">Press Start for a new game!</span>\
		</div>';
		overlay.style.filter = "hue-rotate("+winner.color+"deg)";
		world.appendChild(overlay);
		winner.graphics.style.transition = "left, top";
		winner.graphics.style.transitionDuration = "2s";
		winner.graphics.style.transitionTimingFunction = "ease-in-out";
		winner.graphics.firstChild.style.transition = "width";
		winner.graphics.firstChild.style.transitionDuration = "2s";
		
		setTimeout(function(){			
			for(var child of world.childNodes){
			if(child != winner.graphics && child != overlay){
				world.removeChild(child);
			}
		}
			overlay.style.opacity = 1;
			winner.graphics.style.left = (width/2)+"px";
			winner.graphics.style.top = (height/2)+"px";
			
		}.bind(this), 100);
	}

	
	
}