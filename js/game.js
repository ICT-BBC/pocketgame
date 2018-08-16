

var game = new Game();

function Game(){
	var conf = {
		 canvas: document.getElementById("renderCanvas")
		,canvasContainer: document.getElement("canvasContainer")
	};
	
	var height = ~~(conf.canvasContainer.clientHeight);
	var width = ~~(conf.canvasContainer.clientWidth);

	canvas.height = height;
	canvas.width = width;
	
	var graphics = new Graphics(canvas, canvasContainer);
}

function Graphics(canvas, canvasContainer){
	var context = canvas.getContext("2d");

	
}


function Player(pos, points, rotation){
	this.pos = pos;
	this.points = points;
	this.rotation = rotation;
}



