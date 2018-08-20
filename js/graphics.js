

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