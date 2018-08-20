

function Graphics(game){
	
	var assetPath = "assets/"

	var assets = {
		drone: {
			 id: "drone"
			,path: assetPath + "drone.svg"
		},
		marker: {
			 id: "marker"
			,path: assetPath + "marker.svg"
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
	var markerTemplate;
	var fuelTemplate;
	
	init();
	
	
	this.render = function(){
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
		}
	}
	
	
	function init(){
		world = document.getElementById("world");
		world.style.backgroundImage = "url("+assets.background.path+")";

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

		markerTemplate = document.createElement("object");
		markerTemplate.type = "image/svg+xml";
		markerTemplate.data = assets.marker.path;
		markerTemplate.className = "marker";
		markerTemplate.width = c.graphics.markerWidth;
		markerTemplate.style.marginTop = (-c.graphics.markerHeight/2)+"px";
		markerTemplate.style.marginLeft = (-c.graphics.markerWidth0/2)+"px";
		tempContainer = document.createElement("div");
		tempContainer.appendChild(markerTemplate);
		markerTemplate = tempContainer.innerHTML;

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