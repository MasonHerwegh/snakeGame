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
	buttonElement.id = buttonId;
	buttonElement.style.display = "block";
	buttonElement.style.width = bCoord2[0] + "px";
	buttonElement.style.height = bCoord2[1] + "px";
	buttonElement.style.top = bCoord1[1] + "px";
	buttonElement.style.left = bCoord1[0] + "px";
	buttonElement.style.position = "absolute";
	document.body.appendChild(buttonElement);
}

var playButton = new buttonMaker("playButton", "green", "black", "Play", [20, 20], [100, 50]);

function playButtonClick(){
	document.getElementById("playButton").onclick = function() {
		console.log("click");
		this.tileC = tile.prototype.c;
		this.snakeCtx = this.tileC.getContext("2d");
		this.snakeCtx.clearRect(0, 0, this.tileC.width, this.tileC.height);
		document.getElementById("playButton").parentNode.removeChild(document.getElementById("playButton"));
		snakeBoard.score = 0;
		snakeBoard.gameOver = false;
		snakeBoard.gameWon = false;
		loopHandler();
	}
}

playButtonClick();