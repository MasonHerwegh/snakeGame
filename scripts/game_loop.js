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
	this.snake = new snake(this.colCount/2, this.rowCount/2, this);
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
		
		snakeCoords.push([this.snake.head.tileX, this.snake.head.tileY]);
		
		for(i = 0; i < this.snake.body.length; i++) {
			snakeCoords.push([this.snake.body[i].tileX, this.snake.body[i].tileY]);
		}

		while(true) {
			if (this.snake.colliding(this.food)) {
				this.food.moveSelf();
				overlapFlag = true;
			} else {
				overlapFlag = false;
			}

			if(!overlapFlag) {
				break;
			}
		}
	}

	this.renderAll = function() {
		this.ctx.clearRect(0, 0, this.c.width, this.c.height);

		for (var i = 0; i < this.tiles.length; i++) {
			this.tiles[i].render(this.emptyImg.i);
		}
		
		for (var i = 0; i < this.wallTiles.length; i++) {
			this.wallTiles[i].render(this.wallImg.i);
		}
		
		if (this.snakeDirection == "down") {
			this.snake.head.drawRotated(0, this.snake.head, this.snakeImg2.i);
		} else if (this.snakeDirection == "left") {
			this.snake.head.drawRotated(90, this.snake.head, this.snakeImg2.i);
		} else if (this.snakeDirection == "up") {
			this.snake.head.drawRotated(180, this.snake.head, this.snakeImg2.i);
		} else if (this.snakeDirection == "right") {
			this.snake.head.drawRotated(270, this.snake.head, this.snakeImg2.i);
		}
		
		for(var i = 0; i < this.snake.body.length; i++) {
			this.snake.body[i].render(this.snakeImg1.i);
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
function snake(x, y, game) {
	this.head = new tile(x, y, "white");
	this.body = [];
	this.game = game;
	
	this.foodSound = new sound("media/sounds/chomp.wav");
	this.hitSound = new sound("media/sounds/hit.wav");
	this.winSound = new sound("media/sounds/win.wav");
	
	this.colliding = function(tileToCheck) {
		//nothing here yet...
		if (tileToCheck.tileX == this.head.tileX && tileToCheck.tileY == this.head.tileY) {
			return true;
		}
		
		for (bodyTile in this.body) {
			if (tileToCheck.tileX == this.bodyTile.tileX && tileToCheck.tileY == this.bodyTile.tileY) {
				return true;
			} else {
				return false;
			}
		}
	};
	
	this.grow = function() {
		let snakeTail = this.body[this.body.length - 1];
		let deltas = game.delta("grow");
		let newTail = new tile(snakeTail.tileX + deltas[0], snakeTail.tileY + deltas[1]);

		this.body.push(newTail);
		console.log("grew snake, length is: " + this.body.length);
	}
	
	this.move = function() {
		let deltas = this.game.delta("move");

		//Makes the first snake tile the "head" and when it moves makes the first tile the "newHead"
		let newHead = new tile(this.head.tileX + deltas[0], this.head.tileY + deltas[1]);
		
		// detect if snake has collided with itself or a wall or a food
		for (var i = 0; i < this.body.length; i++) {
			//If snake has collided with itself you lose
			if (newHead.tileX == this.game.body[i].tileX && newHead.tileY == this.game.body[i].tileY || newHead.tileX <= 0 || newHead.tileY <= 0 || newHead.tileX >= this.game.colCount - 1 || newHead.tileY >= this.game.rowCount - 1) {
				//snake has collided with self or wall!
				this.hitSound.play();
				this.game.gameOver = true;
			}
	
			//If snake has collided with food it grows
			if (newHead.tileX == this.game.food.foodCoords[0] && newHead.tileY == this.game.food.foodCoords[1]) {
				this.game.score++;
				this.foodSound.play();
				this.grow();
				this.game.food.moveSelf();
			}
	
			if (this.game.score == 5) {
				this.winSound.play();
				this.game.gameOver = true;
			}
		}

		if (!this.game.gameOver && !this.game.gamePause) { //if we haven't lost by collision...
			this.body.unshift(newHead); //add new head tile to front of snakeTiles
			this.head = newHead;
			this.body.pop();	//remove old tail tile from end of snakeTiles
		}
	};
	
	
}

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

function endGame() {
	console.log("You lose, good day sir!");
	snakeBoard.ctx.font = "40px Arial";
	snakeBoard.ctx.fillStyle = "black";

	if (snakeBoard.score == 5){
		snakeBoard.ctx.fillText("You Win!", 120, 250);
	} else {
		snakeBoard.ctx.fillText("You Lose!", 120, 250);
	}

	snakeBoard.snake = new snake(snakeBoard.colCount/2, snakeBoard.rowCount/2, snakeBoard);
	snakeBoard.snakeDirection = "up";

	var playButton = new buttonMaker("playButton", "green", "black", "Play", [160, 270], [100, 50]);
	buttonClick("playButton", true);
}

function pauseGame() {
	console.log("pause");
	snakeBoard.ctx.font = "40px Arial";
	snakeBoard.ctx.fillStyle = "black";
	snakeBoard.ctx.fillText("Paused", 120, 250);

	this.unpauseButton = new buttonMaker("unpauseButton", "green", "black", "Play", [160, 270], [100, 50]);
	buttonClick("unpauseButton");
}

function scoreUpdate() {
	snakeBoard.ctx.font = "11px Arial";
	snakeBoard.ctx.fillStyle = "White";
	snakeBoard.ctx.fillText("Score: " + snakeBoard.score, 300, 9);
}

function loopHandler() { // game loop!
	// anything that should happen every game "tick" //Every game tick lasts 100 ms
	// should go in this function

	snakeBoard.snake.move();
	snakeBoard.renderAll();
	
	//Puts Score on screen
	scoreUpdate();

	if (snakeBoard.gameOver) {
		endGame();
	} else if (snakeBoard.gamePause) {
		pauseGame();
	} else {
		setTimeout(loopHandler, 100);
	}
}