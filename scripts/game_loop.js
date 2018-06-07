window.addEventListener("keydown", snakeMoveHandler);

function game(currentCanvas) {
	if(!currentCanvas){
		this.c = document.createElement("canvas");
		document.body.appendChild(this.c);
	} else {
		this.c = currentCanvas;
	}

	this.ctx = this.c.getContext("2d");
	this.scale = 10;
	this.c.width = 400;
	this.c.height = 600;

	this.rowCount = Math.floor(this.c.height / this.scale);
	this.colCount = Math.floor(this.c.width / this.scale);

	this.tiles = [];
	this.snakeTiles = [];
	this.wallTiles = [];
	this.snakeDirection = "up";
	this.gameOver = false;
	this.food = new foodTile(1, 1);
	this.score = 0;
	this.gameOver = false;
	this.gamePause = false;
	
	this.appleImg = new createImage("media/graphics/apple.png");
	this.emptyImg = new createImage("media/graphics/grass.png");
	this.wallImg = new createImage("media/graphics/wall.png");
	this.snakeImg1 = new createImage("media/graphics/snake-body.png");
	this.snakeImg2 = new createImage("media/graphics/snake-head.png");

	//Initialize Snake
	this.snakeTiles.push(new snakeTile(this.colCount / 2, this.rowCount / 2));
	
	for (i = 0; i < this.colCount; i++) {
		for (j = 0; j < this.rowCount; j++) {
			if (i == 0 || j == 0 || i == this.colCount - 1 || j == this.rowCount - 1) {
				this.wallTiles.push(new wallTile(i, j));
			} else {
				this.tiles.push(new emptyTile(i, j));
			}
		}
	}
	
	this.foodOverlap = function() {
		let snakeCoords = [];
		let overlapFlag = false;
			
		for(i = 0; i < this.snakeTiles.length; i++) {
			snakeCoords.push([this.snakeTiles[i].tileX, this.snakeTiles[i].tileY]);
		}

		while(true) {
			for(i = 0; i < snakeCoords.length; i++) {
				if(snakeCoords[i][0] == this.food.foodCoords[0] && snakeCoords[i][1] == this.food.foodCoords[1]) {
					this.food.moveSelf();
					overlapFlag = true;
				}
			}

			if(!overlapFlag) {
				break;
			}
		}
	}
	
	//TODO: move drawRotated to the tile function
	

	this.renderAll = function() {
		this.ctx.clearRect(0, 0, this.c.width, this.c.height);

		for (var i = 0; i < this.tiles.length; i++) {
			this.tiles[i].render(this.emptyImg.i);
		}
		
		for (var i = 0; i < this.wallTiles.length; i++) {
			this.wallTiles[i].render(this.wallImg.i);
		}
		
		for(var i = 0; i < this.snakeTiles.length; i++) {
			this.snakeTiles[i].render(this.snakeImg1.i);
		}
		
		if (this.snakeDirection == "down") {
			snakeTile.prototype.drawRotated(0, this.snakeTiles[0], this.snakeImg2.i);
		} else if (this.snakeDirection == "left") {
			snakeTile.prototype.drawRotated(90, this.snakeTiles[0], this.snakeImg2.i);
		} else if (this.snakeDirection == "up") {
			snakeTile.prototype.drawRotated(180, this.snakeTiles[0], this.snakeImg2.i);
		} else if (this.snakeDirection == "right") {
			snakeTile.prototype.drawRotated(270, this.snakeTiles[0], this.snakeImg2.i);
		}
		
		this.foodOverlap();
		this.food.render(this.appleImg.i);
	};

	this.delta = function(mode) {
		let deltaPatterns = [[0, 1], [0, -1], [1, 0], [-1, 0]];

		if (this.snakeDirection == "up" && mode == "grow") 	{ return deltaPatterns[0]; }
		if (this.snakeDirection == "down" && mode == "grow") 	{ return deltaPatterns[1]; }
		if (this.snakeDirection == "left" && mode == "grow") 	{ return deltaPatterns[2]; }
		if (this.snakeDirection == "right" && mode == "grow") 	{ return deltaPatterns[3]; }
		if (this.snakeDirection == "up" && mode == "move") 	{ return deltaPatterns[1]; }
		if (this.snakeDirection == "down" && mode == "move") 	{ return deltaPatterns[0]; }
		if (this.snakeDirection == "left" && mode == "move") 	{ return deltaPatterns[3]; }
		if (this.snakeDirection == "right" && mode == "move") 	{ return deltaPatterns[2]; }
	};
}

//TODO: create snake object and move snake related functions into it

function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function() {
		this.sound.play();
	}
	this.stop = function() {
		this.sound.stop();
	}
}

function createImage(src) {
	this.i = document.createElement("img");
	this.i.src = src;
}

function snakeGrow() {
	let snakeTail = snakeBoard.snakeTiles[snakeBoard.snakeTiles.length - 1];
	let deltas = snakeBoard.delta("grow");
	let newTail = new snakeTile(snakeTail.tileX + deltas[0], snakeTail.tileY + deltas[1]);

	snakeBoard.snakeTiles.push(newTail);
	console.log("grew snake, length is: " + snakeBoard.snakeTiles.length);
}

function tile(x, y, color) {
	this.tileX = x;
	this.tileY = y;
	this.pixelX = this.tileX * this.scale;
	this.pixelY = this.tileY * this.scale;
	this.color = color;
	
	this.render = function(img) {
			this.ctx.drawImage(img, this.pixelX, this.pixelY, this.scale, this.scale);
	};
	
	this.drawRotated = function(degrees, tileToRender, renderImage) {
		let savedPixelX = tileToRender.pixelX;
		let savedPixelY = tileToRender.pixelY;
		this.ctx.save();
		this.ctx.translate(tileToRender.pixelX+this.scale/2, tileToRender.pixelY+this.scale/2);
		tileToRender.pixelX = -this.scale/2;
		tileToRender.pixelY = -this.scale/2;
		this.ctx.rotate(degrees*Math.PI/180);
		tileToRender.render(renderImage);
		tileToRender.pixelX = savedPixelX;
		tileToRender.pixelY = savedPixelY;
		this.ctx.restore();
	};
}

tile.prototype = new game();

function wallTile(x, y) {
	tile.call(this, x, y, "black");
}

function snakeTile(x, y) {
	tile.call(this, x, y, "white");

	this.snakeMove = function() {
		let deltas = snakeBoard.delta("move");
		
		let foodSound = new sound("media/sounds/chomp.wav");
		let hitSound = new sound("media/sounds/hit.wav");
		let winSound = new sound("media/sounds/win.wav");

		//Makes the first snake tile the "head" and when it moves makes the first tile the "newHead"
		let snakeHead = snakeBoard.snakeTiles[0];
		let newHead = new snakeTile(snakeHead.tileX + deltas[0], snakeHead.tileY + deltas[1]);
		
		// detect if snake has collided with itself or a wall or a food
		for (var i = 0; i < snakeBoard.snakeTiles.length; i++) {
			//If snake has collided with itself you lose
			if (newHead.tileX == snakeBoard.snakeTiles[i].tileX && newHead.tileY == snakeBoard.snakeTiles[i].tileY || newHead.tileX <= 0 || newHead.tileY <= 0 || newHead.tileX >= snakeBoard.colCount - 1 || newHead.tileY >= snakeBoard.rowCount - 1) {
				//snake has collided with self or wall!
				hitSound.play();
				snakeBoard.gameOver = true;
			}
	
			//If snake has collided with food it grows
			if (newHead.tileX == snakeBoard.food.foodCoords[0] && newHead.tileY == snakeBoard.food.foodCoords[1]) {
				snakeBoard.score++;
				foodSound.play();
				snakeGrow();
				snakeBoard.food.moveSelf();
			}
	
			if (snakeBoard.score == 5) {
				winSound.play();
				snakeBoard.gameOver = true;
			}
		}

		if (!snakeBoard.gameOver && !snakeBoard.gamePause) { //if we haven't lost by collision...
			snakeBoard.snakeTiles.unshift(newHead); //add new head tile to front of snakeTiles
			snakeBoard.snakeTiles.pop();	//remove old tail tile from end of snakeTiles
		}
	}
}

function foodTile(x, y) {
	tile.call(this, x, y, "yellow");

	this.getRndInteger = function(min, max) {
		return Math.floor(Math.random() * (max - min) ) + min;
	};

	this.moveSelf = function() {
		this.foodCoords = [this.getRndInteger(1, this.colCount - 2), this.getRndInteger(1, this.rowCount - 2)];
		
		this.tileX = this.foodCoords[0];
		this.tileY = this.foodCoords[1];
		this.pixelX = this.tileX * this.scale;
		this.pixelY = this.tileY * this.scale;
	};
}

function emptyTile(x, y) {
	tile.call(this, x, y, "red");
}

wallTile.prototype = new tile();
snakeTile.prototype = new tile();
foodTile.prototype = new tile();
emptyTile.prototype = new tile();

var snakeBoard = new game(tile.prototype.c);
snakeBoard.food.moveSelf();

function snakeMoveHandler(event) {

	if (event.keyCode == 37) {
		snakeBoard.snakeDirection = "left";
	}

	if (event.keyCode == 38) {
		snakeBoard.snakeDirection = "up";
	}

	if (event.keyCode == 39) {
		snakeBoard.snakeDirection = "right";
	}

	if (event.keyCode == 40) {
		snakeBoard.snakeDirection = "down";
	}

	if (event.keyCode == 16 && !snakeBoard.gameOver) {
		snakeBoard.gamePause = true;
	}
}

function loopHandler() { // game loop!

	// anything that should happen every game "tick" //Every game tick lasts 100 ms
	// should go in this function

	snakeBoard.snakeTiles[0].snakeMove();
	snakeBoard.renderAll();
	
	//Puts Score on screen
	snakeBoard.ctx.font = "11px Arial";
	snakeBoard.ctx.fillStyle = "White";
	snakeBoard.ctx.fillText("Score: " + snakeBoard.score, 300, 9);

	//TODO: move stuff like ctx to own function
	if (snakeBoard.gameOver) {
		console.log("You lose, good day sir!");
		snakeBoard.ctx.font = "40px Arial";
		snakeBoard.ctx.fillStyle = "black";

		if (snakeBoard.score == 5){
			snakeBoard.ctx.fillText("You Win!", 120, 250);
		} else {
			snakeBoard.ctx.fillText("You Lose!", 120, 250);
		}

		snakeBoard.snakeTiles = [];
		snakeBoard.snakeDirection = "up";
		//reinitializes snake
		snakeBoard.snakeTiles.push(new snakeTile(snakeBoard.colCount / 2, snakeBoard.rowCount / 2));

		var playButton = new buttonMaker("playButton", "green", "black", "Play", [160, 270], [100, 50]);
		buttonClick("playButton", true);
	} else if (snakeBoard.gamePause) {
		console.log("pause");
		snakeBoard.ctx.font = "40px Arial";
		snakeBoard.ctx.fillStyle = "black";
		snakeBoard.ctx.fillText("Paused", 120, 250);

		var unpauseButton = new buttonMaker("unpauseButton", "green", "black", "Play", [160, 270], [100, 50]);
		buttonClick("unpauseButton");
	} else {
		setTimeout(loopHandler, 100);
	}
}