

function Graphics(game){
	
	var assetPath = "assets/"

	var assets = {
		drone: {
			 id: "drone"
			,path: assetPath + "drone.svg"
		},
		projectile: {
			 id: "projectile"
			,path: assetPath + "projectile.svg"
		},
		fuel: {
			 id: "fuel"
			,path: assetPath + "fuel.svg"
		},
		background: {
			 id: "background"
			,path: assetPath + "floortile.svg"
		}
	};
	
	var world;
	var droneTemplate;
	var projectileTemplate;
	var fuelTemplate;
	
	var width;
	var height;
	
	var canvas;
	var context;
	var fontSize = 36;
	
	init();
	
	
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
				element.innerHTML = droneTemplate;
					
				player.graphics = element;
				world.appendChild(element);
			}
			
			player.graphics.style.top = player.pos.y + "px";
			player.graphics.style.left = player.pos.x + "px";
			player.graphics.firstChild.style.transform = "rotate("+(player.angle-Math.PI)+"rad)";
			
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
				element.innerHTML = projectileTemplate;
					
				projectile.graphics = element;
				world.appendChild(element);
			}
			
			projectile.graphics.style.top = projectile.pos.y + "px";
			projectile.graphics.style.left = projectile.pos.x + "px";
			projectile.graphics.firstChild.style.transform = "rotate("+(projectile.angle-Math.PI)+"rad)";
			
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
	
	this.removeEntity = function(entity){
		if(entity.graphics){
			world.removeChild(entity.graphics);
			return entity;
		}
	}
	
	
	function init(){
		world = document.getElementById("world");
		world.style.backgroundImage = "url("+assets.background.path+")";
		
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
	}

	
	
}