
/*
****Global Variables Start
*/
let alphaPixel = [255,0,0,255] // red, green, blue and alpha transparency
let backgroundColorPixel = [255,255,255,255]; //white color pixel with full alpha
let currentLineCoords = [100,100,300,300]; //random x1,y1 and x2,y2 values
let linesBuffer = [];


class Line2D 
{
	constructor(x1,y1,x2,y2)
	{
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}
	
}

var line1 = new Line2D();
line1.x1 = 10;
line1.y1 = 10;
line1.x2 = 300;
line1.y2 = 300;

console.log(line1);

var line2 = new Line2D();
line2.x1 = 50;
line2.y1=50;
line2.x2 = 150;
line2.y2=150;

console.log(line2);










/*
*****Global Variables End
*/

/*
Todo#1 - Change the alphaPixel variable to something more clear like currentPixel or similiar


*/


function initCanvas()
{
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imageData = ctx.getImageData(0,0,1,1);

    

    

}

function testPlotPixel()
{
	plotPixelAtXY(100,100);
	plotPixelAtXY(101,100);
	plotPixelAtXY(102,100);
	plotPixelAtXY(103,100);
	plotPixelAtXY(104,100);
	plotPixelAtXY(105,100);
	plotPixelAtXY(106,100);
	plotPixelAtXY(107,100);
	plotPixelAtXY(108,100);
}

function clearCanvas()
{
	var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    ctx.clearRect(0,0,canvasWidth, canvasHeight);

}

function plotPixelAtXY(x, y)//plots a red pixel at x,y coordinates
{
	var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    var imageData = ctx.getImageData(0,0,1,1);
    //ctx.clearRect(0,0,canvasWidth, canvasHeight);
    imageData.data[3] = alphaPixel[3];
    
    var r = alphaPixel[0];
    var g = alphaPixel[1];
    var b = alphaPixel[2];

    imageData.data[0] = r;
    imageData.data[1] = g;
    imageData.data[2] = b;

    ctx.putImageData(imageData, x, y);
    
}


function drawDDALine(x1, y1, x2, y2)
{
	const dx = x2  - x1;
	const dy = y2 - y1;

	steps = (Math.abs(dx) > Math.abs(dy) ) ? Math.abs(dx) : Math.abs(dy);

	const xInc = dx/ parseFloat(steps);
	const yInc = dy/ parseFloat(steps);

	let x = x1;
	let y = y1;

	for(var i = 0; i <= steps; i++)
	{
		plotPixelAtXY(Math.round(x), Math.round(y));
		x+=xInc;
		y+=yInc;
	}
	var currentLine = new Line2D();
	currentLine.x1 = x1;
	currentLine.y1 = y1;
	currentLine.x2 = x2;
	currentLine.y2 = y2;
	linesBuffer.push(currentLine);


}
function setCurrentDrawnLineCoords(x1,y1,x2,y2)
{
	currentLineCoords[0] = x1;
	currentLineCoords[1] = y1;
	currentLineCoords[2] = x2;
	currentLineCoords[3] = y2;

}


function setCurrentColor(red, green, blue, alpha=255) // inputs rgb color values as 0<=value<=255
{
	alphaPixel[0] = red;
	alphaPixel[1] = green;
	alphaPixel[2] = blue; 
	alphaPixel[3] = alpha
}

function drawParallelLine(x1,y1, x2,y2)
{	
	let offset = 5;
	drawDDALine(x1+offset, y1, x2+offset,y2);
	
}

function drawDynamicParallelLine(offset)
{
	var ourLine = new Line2D();
	ourLine.x1 = linesBuffer[0].x1;
	ourLine.y1 = linesBuffer[0].y1;
	ourLine.x2 = linesBuffer[0].x2;
	ourLine.y2 = linesBuffer[0].y2;
	


	drawDDALine(ourLine.x1+offset, ourLine.y1,ourLine.x2+offset,ourLine.y2);	

}


function clearLastDrawnLineSegment()
{
	var previousPixel = [];
	previousPixel[0] = alphaPixel[0];
	previousPixel[0] = alphaPixel[0];
	previousPixel[0] = alphaPixel[0];
	previousPixel[0] = alphaPixel[0];

	alphaPixel[0] = backgroundColorPixel[0];
	alphaPixel[1] = backgroundColorPixel[1];
	alphaPixel[2] = backgroundColorPixel[2];
	alphaPixel[3] = backgroundColorPixel[3];

	var lineToBeErased = linesBuffer[linesBuffer.length-1];
	linesBuffer.pop()// this is the line to be eraased.
	drawDDALine(lineToBeErased.x1,lineToBeErased.y1, lineToBeErased.x2, lineToBeErased.y2);
	linesBuffer.pop();//this is the erase-line. No need for this.(the white colorline we draw on top of the colored line)

	console.log('cleared last drawn line-segment');
	setCurrentColor(0,0,255,255);// set line color blue
	



}

function drawScreen()
{
	console.log('Script loaded: true');
	initCanvas();
	clearCanvas();
	

	var [x1,y1,x2,y2] = [100,100,350,350];
	
	
	setCurrentColor(255,0,0,255);
	drawDDALine(x1,y1, x2,y2);
	
	

	setCurrentColor(0,0,255,255);// set line color blue
	drawParallelLine(x1,y1, x2, y2);

	console.log('linesBuffer length:'+linesBuffer.length);


	const debugWindow = document.querySelector('#debugParagraph');
	debugWindow.innerHTML = `x1:${x1}, y1:${y1},</br> x2:${x2}, y2:${y2}`;
}


window.onload = drawScreen;
