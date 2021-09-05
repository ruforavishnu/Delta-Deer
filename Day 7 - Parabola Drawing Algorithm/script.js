


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
Todo#4 - write DDA line algorithm to check whether to mark endpoints by using an extra parameter markEndpoints=true
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

	//markLineEndpoints(currentLine);
	//markLineSlope(currentLine);
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
function drawMidpointEllipse(centerX, centerY, xRadius, yRadius)
{
	//mathematical equation of the ellipse is x2/a2 + y2/b2 = 1




	var dx, dy, d1, d2, x, y;
	x = 0;
	y = yRadius;

	//d1 is decision parameter for Region 1
	d1 = (yRadius*yRadius) - (xRadius*xRadius*yRadius) + (0.25*xRadius*xRadius);
	dx = 2*yRadius*yRadius*x;
	dy = 2*xRadius*xRadius*y;

	//draw Region 1
	while(dx < dy)
	{
		plotPixelAtXY(x+centerX, y+centerY);
		plotPixelAtXY(-x+centerX, y+centerY);
		plotPixelAtXY(x+centerX, -y+centerY);
		plotPixelAtXY(-x+centerX, -y+centerY);

		if(d1 < 0)
		{
			x+=1;
			dx = dx + (2*yRadius*yRadius);
			d1 = d1 + dx + (yRadius*yRadius);
		}
		else
		{
			x+=1;
			y-=1;
			dx = dx + (2*yRadius*yRadius);
			dy = dy - (2*xRadius*xRadius);
			d1 = d1 + dx - dy + (yRadius*yRadius);
		}
	}
	//d2 is decision parameter for region 2
	d2 = ( (yRadius*yRadius) * ((x+0.5) * (x+0.5)) ) + ( (xRadius*xRadius)* ( (y-1)*(y-1) )  )  - (xRadius*xRadius*yRadius*yRadius);
	
	while(y >= 0)	
	{
		plotPixelAtXY(x + centerX, y + centerY);
		plotPixelAtXY(-x + centerX, y + centerY);
		plotPixelAtXY(x + centerX, -y + centerY);
		plotPixelAtXY(-x + centerX, -y + centerY);

		if ( d2 > 0 )
		{
			y--;
			dy = dy - (2*xRadius*xRadius);
			d2 = d2 + (xRadius*xRadius) - dy;
		}
		else
		{
			y--;
			x++;
			dx = dx + (2*yRadius*yRadius);
			dy = dy - (2*xRadius*xRadius);
			d2 = d2 + dx - dy + (xRadius*xRadius);
		}
	}
}
function drawAdvancedParabola(centerX, centerY, length, xParameter, yParameter)
{
	//our better parabola eqn with parameters is by = ax² so plot it

	x = centerX;
	y = centerY;
	var pointsBuffer = [];
	var myPoint = { x:0, y:0 };
	var a = xParameter;
	var b = yParameter;


	
	

	

	//draw points on the right half of the parabola
	for(var i = 0; i < length; i++)
	{
		var x = i;
		var y = i*i;

		y = (a * (x*x))/b;

		myPoint.x = x;
		myPoint.y = y;

		var reqdPoint = { x: 0, y: 0};
		reqdPoint.x = centerX+myPoint.x;;
		reqdPoint.y = centerY+myPoint.y;
		pointsBuffer.push(reqdPoint);
		plotPixelAtXY(reqdPoint.x, reqdPoint.y);
		
	}

	//connect all points on the parabola with a line
	for(var i = 0; i < pointsBuffer.length-1; i++)
	{
		
		var currentPoint = pointsBuffer[i];
		var nextPoint = pointsBuffer[i+1];
		drawDDALine(currentPoint.x,currentPoint.y, nextPoint.x, nextPoint.y);

	}

	//draw points on the left half of the parabola
	pointsBuffer = [];

	for(var i = 0; i < length; i++)
	{
			
		var x = i;
		var y = i*i;

		y = (a * (x*x))/b;

		myPoint.x = x;
		myPoint.y = y;

		var reqdPoint = { x: 0, y: 0};
		reqdPoint.x = centerX-myPoint.x;;
		reqdPoint.y = centerY+myPoint.y;
		pointsBuffer.push(reqdPoint);
		plotPixelAtXY(reqdPoint.x, reqdPoint.y);

	}

	
	//connect all points on the parabola with a line
	
	for(var i = 0; i < pointsBuffer.length-1; i++)
	{
		var currentPoint = pointsBuffer[i];
		var nextPoint = pointsBuffer[i+1];
		drawDDALine(currentPoint.x,currentPoint.y, nextPoint.x, nextPoint.y);
	}
	


}

function drawParabola(centerX, centerY, length)
{
	x = centerX;
	y = centerY;
	var pointsBuffer = [];
	var myPoint = { x:0, y:0 };
	
	//our parabola eqn is y = x² so plot it

	

	//draw points on the right half of the parabola
	for(var i = 0; i < length; i++)
	{
		
		myPoint.x = i;
		myPoint.y = (i*i);

		var reqdPoint = { x: 0, y: 0};
		reqdPoint.x = centerX+myPoint.x;;
		reqdPoint.y = centerY+myPoint.y;
		pointsBuffer.push(reqdPoint);
		plotPixelAtXY(reqdPoint.x, reqdPoint.y);
		
	}

	//connect all points on the parabola with a line
	for(var i = 0; i < pointsBuffer.length-1; i++)
	{
		
		var currentPoint = pointsBuffer[i];
		var nextPoint = pointsBuffer[i+1];
		drawDDALine(currentPoint.x,currentPoint.y, nextPoint.x, nextPoint.y);

	}

	//draw points on the left half of the parabola
	pointsBuffer = [];

	for(var i = 0; i < length; i++)
	{
			
		myPoint.x = i;
		myPoint.y = (i*i);

		var reqdPoint = { x: 0, y: 0};
		
		reqdPoint.x = centerX-myPoint.x;;
		reqdPoint.y = centerY+myPoint.y;
		pointsBuffer.push(reqdPoint);		
		plotPixelAtXY(reqdPoint.x, reqdPoint.y);

	}

	
	//connect all points on the parabola with a line
	
	for(var i = 0; i < pointsBuffer.length-1; i++)
	{
		var currentPoint = pointsBuffer[i];
		var nextPoint = pointsBuffer[i+1];
		drawDDALine(currentPoint.x,currentPoint.y, nextPoint.x, nextPoint.y);
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

	
	
	setCurrentColor(255,0,0,255);
	drawAdvancedParabola(250,250,45, 2,30);
	drawAdvancedParabola(350,250,300,2,1000);
	
	var t3 = Date.now();
	elapsedTime = t3-t2;
	console.log('Time taken for drawing ellipse :'+elapsedTime+' milliseconds');

	





	
	const debugWindow = document.querySelector('#debugParagraph');
	// debugWindow.innerHTML = `x1:${x1}, y1:${y1},</br> x2:${x2}, y2:${y2}`;
}


window.onload = drawScreen;
