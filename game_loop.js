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
	this.snakeDirection = "up";
	this.gameOver = false;
	this.food = 0;
	this.score = 0;

	//Initialize Snake
	this.snakeTiles.push(new snakeTile(this.colCount / 2, this.rowCount / 2));
	
	for (i = 0; i < this.colCount; i++) {
		for (j = 0; j < this.rowCount; j++) {
			if (i == 0 || j == 0 || i == this.colCount - 1 || j == this.rowCount - 1) {
				this.tiles.push(new wallTile(i, j));
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
				if(snakeCoords[i][0] == food.foodCoords[0] && snakeCoords[i][1] == food.foodCoords[1]) {
					food.moveSelf();
					overlapFlag = true;
				}
			}

			if(!overlapFlag) {
				//this.food = new foodTile(this.foodCoords[0], this.foodCoords[1]);
				//food.x = food.foodCoords[0];
				//food.y = food.foodCoords[1];
				break;
			}
		}
	}

	
	//TODO: Move moveFood out of game object
	

	this.renderAll = function() {
		this.ctx.clearRect(0, 0, this.c.width, this.c.height);

		for (var i = 0; i < this.tiles.length; i++) {
			this.tiles[i].render();
		}
		
		for(var i = 0; i < this.snakeTiles.length; i++) {
			this.snakeTiles[i].render();
		}
		
		//this.foodOverlap();
		console.log(tile.x, tile.y);
		food.render();
	};
	
	//When an arrow key is pressed their x or y coordinate goes up or down by 1
	//TODO: move snakeMove function out of game object
	this.snakeMove = function() {
		let deltas = this.delta("move");

		//Makes the first snake tile the "head" and when it moves makes the first tile the "newHead"
		let snakeHead = this.snakeTiles[0];
		let newHead = new snakeTile(snakeHead.tileX + deltas[0], snakeHead.tileY + deltas[1]);
		
		// detect if snake has collided with itself or a wall or a food
		for (var i = 0; i < this.snakeTiles.length; i++) {
			//If snake has collided with itself you lose
			if (newHead.tileX == this.snakeTiles[i].tileX && newHead.tileY == this.snakeTiles[i].tileY || newHead.tileX <= 0 || newHead.tileY <= 0 || newHead.tileX >= this.colCount - 1 || newHead.tileY >= this.rowCount - 1) {
				//snake has collided with self or wall!
				this.gameOver = true;
			}

			//If snake has collided with food it grows
			if (newHead.tileX == food.foodCoords[0] && newHead.tileY == food.foodCoords[1]) {
				this.score++;
				snakeGrow();
				this.moveFood();
			}

			if (this.score == 5) {
				this.gameOver = true;
			}
		}

		if (!this.gameOver && !this.gameWon && !this.gamePause) { //if we haven't lost by collision...
			this.snakeTiles.unshift(newHead); //add new head tile to front of snakeTiles
			this.snakeTiles.pop();	//remove old tail tile from end of snakeTiles
		}
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
	
	this.render = function() {
		this.ctx.fillStyle = this.color;

		//fillRect needs pixel coordinates, not tile coordinates
		this.ctx.fillRect(this.pixelX, this.pixelY, this.scale, this.scale);
	};
}

tile.prototype = new game();

function wallTile(x, y) {
	tile.call(this, x, y, "black");
}

function snakeTile(x, y) {
	tile.call(this, x, y, "white");
}

function foodTile(x, y) {
	tile.call(this, x, y, "yellow");

	this.moveSelf = function() {
		this.getRndInteger = function(min, max) {
			return Math.floor(Math.random() * (max - min) ) + min;
		};

		this.foodCoords = [this.getRndInteger(1, this.colCount - 2), this.getRndInteger(1, this.rowCount - 2)];
		
		tile.x = this.foodCoords[0];
		tile.y = this.foodCoords[1];
	}
}

function emptyTile(x, y) {
	tile.call(this, x, y, "red");
}

wallTile.prototype = new tile();
snakeTile.prototype = new tile();
foodTile.prototype = new tile();
emptyTile.prototype = new tile();

var food = new foodTile();

var snakeBoard = new game(tile.prototype.c);
food.moveSelf();
snakeBoard.renderAll();


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

	if (event.keyCode == 16 && !snakeBoard.gameWon && !snakeBoard.gameOver) {
		snakeBoard.gamePause = true;
	}
}

function loopHandler() { // game loop!

	// anything that should happen every game "tick" //Every game tick lasts 100 ms
	// should go in this function

	snakeBoard.snakeMove();
	snakeBoard.renderAll();
	
	//Puts Score on screen
	snakeBoard.ctx.font = "11px Arial";
	snakeBoard.ctx.fillStyle = "White";
	snakeBoard.ctx.fillText("Score: " + snakeBoard.score, 300, 9);

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