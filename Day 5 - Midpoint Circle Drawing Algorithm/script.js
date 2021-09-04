


/*
************************************************************************
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

var Gcanvas = document.getElementById('canvas');
var Gctx = canvas.getContext('2d');
var GcanvasWidth = Gcanvas.width;
var GcanvasHeight = Gcanvas.height;


/*
*****Global Variables End
************************************************************************
*/

/*
Todo#1 - Change the alphaPixel variable to something more clear like currentPixel or similiar
Todo#2 - write function to convert from world coordinates to screen coordinates 
Todo#3- test time taken for drawing DDA line
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

	markLineEndpoints(currentLine);
	markLineSlope(currentLine);
	linesBuffer.push(currentLine);

}

function drawDDALineWithAnimation(x1,y1,x2,y2)
{
	const dx = x2  - x1;
	const dy = y2 - y1;

	steps = (Math.abs(dx) > Math.abs(dy) ) ? Math.abs(dx) : Math.abs(dy);

	const xInc = dx/ parseFloat(steps);
	const yInc = dy/ parseFloat(steps);



	let x = x1;
	let y = y1;

	var i = 0;
	var timer = setInterval(function()
	{
		plotPixelAtXY(Math.round(x), Math.round(y));

		x+=xInc;
		y+=yInc;
		i++;
		console.log('plotting a pixel');
		if(i == steps)
		{
			console.log('i reached value of steps.Quitting interval ');
			clearInterval(timer);

		}
	}, 10);
	
	
	
	var currentLine = new Line2D();
	currentLine.x1 = x1;
	currentLine.y1 = y1;
	currentLine.x2 = x2;
	currentLine.y2 = y2;

	markLineEndpoints(currentLine);
	markLineSlope(currentLine);
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
	var ourLine = linesBuffer[linesBuffer.length-1];
	drawOffsettedParallelLine(ourLine, offset);
}

function drawOffsettedParallelLine(line, offset)/*Function for CG Library use*/
{
	var ourLine = new Line2D();
	ourLine.x1 = line.x1;
	ourLine.y1 = line.y1;
	ourLine.x2 = line.x2;
	ourLine.y2 = line.y2;
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
	linesBuffer.pop()// this is the line to be erased.
	drawDDALine(lineToBeErased.x1,lineToBeErased.y1, lineToBeErased.x2, lineToBeErased.y2);
	linesBuffer.pop();//this is the erase-line. No need for this.(this is the white color line we draw on top of the colored line )

	console.log('cleared last drawn line-segment');
	setCurrentColor(0,0,255,255);// set line color blue
	



}

function markLineEndpoints(line)//next add line slope to this
{
	const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = "10px Arial";

    let x = line.x1;
    let y = line.y1;
    let str = "("+x+","+y+")";
    ctx.fillText(str,x,y);

    x = line.x2;
    y = line.y2;
    str = "("+x+","+y+")";
	ctx.fillText(str,x,y);


}
function markLineSlope(line)
{
	const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = "10px Arial";

    let x = line.x2;
    let y = line.y2;
    let m = (line.y2-line.y1)/(line.x2-line.x1);

    let str = "(m:"+m.toFixed(3)+")";
    ctx.fillText(str,x+50,y);

}
function drawMidpointCircle(centerX,centerY, radius)
{

	var x = radius;
	var y = 0;

	var p = 1 - radius;

	while( x>y )
	{
		
		y+=1;

		if(p<=0)
		{
			p = p + 2*y + 1;

		}
		else
		{
			x-=1;
			p = p + 2*y - 2*x + 1;
		}

		if(x<y)
			break;

		plotPixelAtXY(x+centerX, y+centerY);
		plotPixelAtXY(-x+centerX, y+centerY);
		plotPixelAtXY(x+centerX, -y+centerY);
		plotPixelAtXY(-x+centerX, -y+centerY);
		

		if( x!= y)
		{
			plotPixelAtXY(y+centerX, x+centerY);
			plotPixelAtXY(-y+centerX, x+centerY);
			plotPixelAtXY(y+centerX, -x+centerY);
			plotPixelAtXY(-y+centerX, -x+centerY);
		}
	}
}

function drawScreen()
{
	console.log('Script loaded: true');
	initCanvas();
	clearCanvas();
	
	setCurrentColor(255,0,0,255);

	

	var t1 = Date.now();
	drawDDALine(200,200, 400,170);//line with slope < 1
	var t2 = Date.now();

	var elapsedTime = t2-t1;
	console.log('Time taken for drawing line :'+elapsedTime+' milliseconds');

	setCurrentColor(200,0,255,255);
	
	drawMidpointCircle(350,150, 100);
	// drawMidpointCircle(350,130, 200);
	// drawMidpointCircle(300,150, 150);
	// drawMidpointCircle(150,56, 300);
	// drawMidpointCircle(230,230, 200);
	// drawMidpointCircle(380,120, 150);
	// drawMidpointCircle(323,178, 30);
	// drawMidpointCircle(320,125, 230);
	// drawMidpointCircle(390,156, 130);
	// drawMidpointCircle(150,59, 347);
	// drawMidpointCircle(233,230, 265);
	// drawMidpointCircle(385,120, 137);
	var t3 = Date.now();
	elapsedTime = t3-t2;
	console.log('Time taken for drawing circle :'+elapsedTime+' milliseconds');





	
	const debugWindow = document.querySelector('#debugParagraph');
	// debugWindow.innerHTML = `x1:${x1}, y1:${y1},</br> x2:${x2}, y2:${y2}`;
}


window.onload = drawScreen;
