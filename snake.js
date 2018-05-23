window.addEventListener("click", clickHandler);

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

function buttonMaker(buttonColor, textColor, buttonText, bCoord1, bCoord2, tCoord) {
	this.buttonColor = buttonColor;
	this.textColor = textColor;
	this.buttonText = buttonText;
	
	ctx.fillStyle=buttonColor;
	ctx.fillRect(bCoord1[0], bCoord1[1], bCoord2[0], bCoord2[1]);
	ctx.stroke();
	
	ctx.fillStyle=textColor;
	ctx.font="40px Arial";
	ctx.fillText(buttonText, tCoord[0], tCoord[1]);
}

var playButton = new buttonMaker("green", "black", "Play", [20, 20], [100, 50], [30, 57]);

function clickHandler(event) {
	playButton.onclick = ctx.clearRect(0, 0, this.c.width, this.c.height);
}