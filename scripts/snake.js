//window.addEventListener("click", clickHandler);

function buttonMaker(buttonId, buttonColor, textColor, buttonText, bCoord1, bCoord2) {
	this.buttonColor = buttonColor;
	this.textColor = textColor;
	this.buttonText = buttonText;
	this.tileC = tile.prototype.c;
	this.snakeCtx = this.tileC.getContext("2d");
	
	this.snakeCtx.fillStyle=buttonColor;
	this.snakeCtx.fillRect(bCoord1[0], bCoord1[1], bCoord2[0], bCoord2[1]);
	this.snakeCtx.stroke();
	
	this.snakeCtx.fillStyle=textColor;
	this.snakeCtx.font="40px Arial";
	this.snakeCtx.fillText(buttonText, bCoord1[0] + 10, bCoord1[1] + 37);

	let buttonElement = document.createElement("div");
	let buttonStyle = buttonElement.style;
	buttonElement.id = buttonId;
	buttonStyle.display = "block";
	buttonStyle.width = bCoord2[0] + "px";
	buttonStyle.height = bCoord2[1] + "px";
	buttonStyle.top = bCoord1[1] + "px";
	buttonStyle.left = bCoord1[0] + "px";
	buttonStyle.position = "absolute";
	document.body.appendChild(buttonElement);
}

var playButton = new buttonMaker("playButton", "green", "black", "Play", [20, 20], [100, 50]);

function buttonClick(name, restart){
	document.getElementById(name).onclick = function() {
		console.log("click");
		this.tileC = tile.prototype.c;
		this.snakeCtx = this.tileC.getContext("2d");
		document.getElementById(name).parentNode.removeChild(document.getElementById(name));
		snakeBoard.gameOver = false;
		snakeBoard.gameWon = false;
		snakeBoard.gamePause = false;
		if (restart) {
			this.snakeCtx.clearRect(0, 0, this.tileC.width, this.tileC.height);
			snakeBoard.score = 0;
		}

		loopHandler();
	}
}

buttonClick("playButton", true);