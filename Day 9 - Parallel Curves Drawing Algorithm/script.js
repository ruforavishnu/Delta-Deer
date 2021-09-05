


/*
************************************************************************
****Global Variables Start
*/
let currentPixel = [255,0,0,255] // red, green, blue and alpha transparency
let backgroundColorPixel = [255,255,255,255]; //white color pixel with full alpha
let currentLineCoords = [100,100,300,300]; //random x1,y1 and x2,y2 values
let linesBuffer = [];
let curvesBuffer = [];
let tempBuffer = [];
let currentCurveLength = 0;




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
Pending Todos
***************
Todo#4 - write DDA line algorithm to check whether to mark endpoints by using an extra parameter markEndpoints=true
Todo#5 - Instead of performing Math.sqrt at runtime, create a super long array filled with values 
of the square roots. for example if you want to find sqrt of 85.37 instead of performing the square root 
operation, before beginning the program itself create a huge array/table of data of all the square roots of 
all numbers from 1-1000 before hand. And if you need to find the square root, just access that particular
value from the array. So instead of performing Math.sqrt you can read the value from the array.
Just make sure for each value example 15.03 and 15.04 and 15.0x till 15.98 and 15.99 till 16.00 are calculated before hand
in the array.

Completed Todos
***************
Todo#1 - Change the alphaPixel variable to something more clear like currentPixel or similiar - COMPLETED
Todo#2 - write function to convert from world coordinates to screen coordinates -COMPLETED
Todo#3- test time taken for drawing DDA line - COMPLETED


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
    imageData.data[3] = currentPixel[3];
    
    var r = currentPixel[0];
    var g = currentPixel[1];
    var b = currentPixel[2];

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
	currentPixel[0] = red;
	currentPixel[1] = green;
	currentPixel[2] = blue; 
	currentPixel[3] = alpha
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
	previousPixel[0] = currentPixel[0];
	previousPixel[0] = currentPixel[0];
	previousPixel[0] = currentPixel[0];
	previousPixel[0] = currentPixel[0];

	currentPixel[0] = backgroundColorPixel[0];
	currentPixel[1] = backgroundColorPixel[1];
	currentPixel[2] = backgroundColorPixel[2];
	currentPixel[3] = backgroundColorPixel[3];

	var lineToBeErased = linesBuffer[linesBuffer.length-1];
	linesBuffer.pop()// this is the line to be erased.
	drawDDALine(lineToBeErased.x1,lineToBeErased.y1, lineToBeErased.x2, lineToBeErased.y2);
	linesBuffer.pop();//this is the erase-line. No need for this.(this is the white color line we draw on top of the colored line )

	console.log('cleared last drawn line-segment');
	setCurrentColor(0,0,255,255);// set line color blue. We dont need to set all 4 array values of currentPixel, calling the function performs the same job.
	



}

function clearLastDrawnCurve()
{
	var previousPixel = [];
	previousPixel[0] = currentPixel[0];
	previousPixel[0] = currentPixel[0];
	previousPixel[0] = currentPixel[0];
	previousPixel[0] = currentPixel[0];

	currentPixel[0] = backgroundColorPixel[0];
	currentPixel[1] = backgroundColorPixel[1];
	currentPixel[2] = backgroundColorPixel[2];
	currentPixel[3] = backgroundColorPixel[3];

	//var curveToBeErased = curvesBuffer[curvesBuffer.length-1];

	var curveToBeErased =  curvesBuffer.pop();//this is the curve to be erased
	
	console.log('curveToBeErased');
	console.log(curveToBeErased);
	for(var i = 0; i < curveToBeErased.curveLength-1; i++)
	{
		
		var currentPoint = curveToBeErased.curveLeftValues[i];
		var nextPoint = curveToBeErased.curveLeftValues[i+1];
		drawDDALine(currentPoint.x,currentPoint.y, nextPoint.x, nextPoint.y);

	}
	for(var i = 0; i < curveToBeErased.curveLength-1; i++)
	{
		
		var currentPoint = curveToBeErased.curveRightValues[i];
		var nextPoint = curveToBeErased.curveRightValues[i+1];
		drawDDALine(currentPoint.x,currentPoint.y, nextPoint.x, nextPoint.y);

	}

	
	currentPixel[0] = previousPixel[0];
	currentPixel[1] = previousPixel[1];
	currentPixel[2] = previousPixel[2];
	currentPixel[3] = previousPixel[3];
	
	
	console.log('curvesBuffer length:'+curvesBuffer.length);
	
	
	


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

function markPoint(point)
{
	const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = "10px Arial";


    let x = point.x;
    let y = point.y;
    plotPixelAtXY(x,y);
    let str = "("+x+","+y+")";
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
	currentCurveLength = length;
	var firstBuffer = [];
	var secondBuffer = [];
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
	tempBuffer = [...tempBuffer,...pointsBuffer];//sperad out all values in pointbuffer to tempbuffer
	firstBuffer = [...firstBuffer,...pointsBuffer];
	console.log('pointsBuffer 1:');
	console.log(pointsBuffer);
	

	pointsBuffer = [];//clear the points buffer
	

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
	

	secondBuffer = [...secondBuffer, ...pointsBuffer];
	tempBuffer = [...tempBuffer,...pointsBuffer];//spread out and append all values in pointsBuffer to tempBuffer
	
	var currentCurve = 
	{
		curveLeftValues: firstBuffer,
		curveRightValues: secondBuffer,
		curveLength: length
	}


	curvesBuffer.push(currentCurve);
	
	console.log('curvesBuffer');
	console.log(curvesBuffer);
	console.log('curvesBuffer length:'+curvesBuffer.length);
	
	
	

}

function drawHyperbola(centerX, centerY, length, xParameter, yParameter)
{
	//Equation of hyperbola is Hyperbola: x²/a² - y²/b² = 1 

	//our better parabola eqn with parameters is by = ax² so plot it

	var pointsBuffer = [];
	var myPoint = { x:0, y:0 };
	var a = xParameter;
	var b = yParameter;
	
	//draw points on the right half of the hyperbola
	for(var i = 0; i < length; i++)
	{
		
		var x = i;		
		var y = Math.sqrt( (b*b)*(1 +  (x*x)/(a*a) ) ) ;
		
		myPoint.x = x;
		myPoint.y = y;
		
		var reqdPoint = { x: 0, y: 0};
		if(xParameter < 0 && yParameter >= 0)//x is negative. y is positive
		{
			reqdPoint.x = centerX-myPoint.x;
			reqdPoint.y = centerY+myPoint.y;
		}
		else if(xParameter >=0 && yParameter < 0)// x is positive. y is negative
		{
			reqdPoint.x = centerX+myPoint.x;
			reqdPoint.y = centerY-myPoint.y;	
		}
		else if(xParameter >= 0 && yParameter >= 0)//x is positive. y is positive
		{
			reqdPoint.x = centerX+myPoint.x;
			reqdPoint.y = centerY+myPoint.y;	
		}
		else if(xParameter < 0 && yParameter < 0)// x is negative. y is negative
		{
			reqdPoint.x = centerX-myPoint.x;
			reqdPoint.y = centerY-myPoint.y;		
		}
		
		reqdPoint.x = parseFloat(reqdPoint.x.toFixed(3));
		reqdPoint.y = parseFloat(reqdPoint.y.toFixed(3));
		
		if(Number.isNaN(reqdPoint.x) || Number.isNaN(reqdPoint.y) )
			break;

		pointsBuffer.push(reqdPoint);
		plotPixelAtXY(reqdPoint.x, reqdPoint.y);//plot the calculated hyperbola pixel 

		
	}
	//connect all points on the hyperbola with a line
	for(var i = 0; i < pointsBuffer.length-1; i++)
	{
		
		var currentPoint = pointsBuffer[i];
		var nextPoint = pointsBuffer[i+1];
		drawDDALine(currentPoint.x,currentPoint.y, nextPoint.x, nextPoint.y);

	}
	
	// draw points on the left half of the hyperbola
	pointsBuffer = [];
	for(var i = 0; i < length; i++)
	{
		
		var x = i;
		var y = Math.sqrt( (b*b)*(1 + (x*x)/(a*a) ) ) ;

		myPoint.x = x;
		myPoint.y = y;
				
		var reqdPoint = { x: 0, y: 0};
		if(xParameter < 0 && yParameter >= 0)//x is negative. y is positive
		{
			reqdPoint.x = centerX+myPoint.x;
			reqdPoint.y = centerY+myPoint.y;
		}
		else if(xParameter >=0 && yParameter < 0)// x is positive. y is negative
		{
			reqdPoint.x = centerX-myPoint.x;
			reqdPoint.y = centerY-myPoint.y;	
		}
		else if(xParameter >= 0 && yParameter >= 0)//x is positive. y is positive
		{
			reqdPoint.x = centerX-myPoint.x;
			reqdPoint.y = centerY+myPoint.y;	
		}
		else if(xParameter < 0 && yParameter < 0)// x is negative. y is negative
		{
			reqdPoint.x = centerX+myPoint.x;
			reqdPoint.y = centerY-myPoint.y;		
		}
		
		
		reqdPoint.x = parseFloat(reqdPoint.x.toFixed(3));
		reqdPoint.y = parseFloat(reqdPoint.y.toFixed(3));
		
		if(Number.isNaN(reqdPoint.x) || Number.isNaN(reqdPoint.y) )
			continue;
		
		pointsBuffer.push(reqdPoint);
		plotPixelAtXY(reqdPoint.x, reqdPoint.y);//plot the pixel on the mirror side of the hyperbola
	
	}
	
	//connect all points on the hyperbola with a line
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
	
	var t2 = Date.now();
	setCurrentColor(255,0,0,255);	
	
	var point = {x:250, y:150}
	markPoint(point);
	drawParabola(point.x,point.y,20);
	
	// setCurrentColor(0,255,0,255);	
	drawParabola(350,100,20);//try with different length also
	drawParabola(350,180,18);//try with different length also
	
	var t3 = Date.now();
	elapsedTime = t3-t2;
	console.log('Time taken for drawing ellipse :'+elapsedTime+' milliseconds');

	
	const debugWindow = document.querySelector('#debugParagraph');
	// debugWindow.innerHTML = `x1:${x1}, y1:${y1},</br> x2:${x2}, y2:${y2}`;
}


window.onload = drawScreen;
