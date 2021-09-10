


/*
************************************************************************
****Global Variables Start
*/
let currentPixel = [255,0,0,255] // red, green, blue and alpha transparency
let backgroundColorPixel = [255,255,255,255]; //white color pixel with full alpha
let currentLineCoords = [100,100,300,300]; //random x1,y1 and x2,y2 values
let linesBuffer = [];
let frameBuffer = [];
let parabolaBuffer = [];
let polygonBuffer = [];

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

class Parabola2D
{
	constructor(x,y, length)
	{
		this.x = x;
		this.y = y;
		this.length = length;
	}
}


class Point2D
{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
	}
}

class Edge2D 
{        
    constructor(startPoint, endPoint, yUpper,intercepts, scanSteps, nextEdge, slanting, slope)
    {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        
        this.yUpper = yUpper;
        this.intercepts = intercepts;
        this.scanSteps = scanSteps;
        this.nextEdge = nextEdge;
        this.slanting = slanting;
        this.slope = slope;
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

function findSlope(line)
{
    
    var m = (line.y2 - line.y1)/(line.x2-line.x1);    
    return m;
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
		// console.log('plotting a pixel');
		if(i == steps)
		{
			// console.log('i reached value of steps.Quitting interval ');
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

function getCurrentColor()
{
    return currentPixel;
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

function drawDynamicParabola(offset)
{
	var ourParabola = parabolaBuffer[parabolaBuffer.length-1];//get last drawn Parabola
	drawOffsettedParabola(ourParabola, offset);

}



function drawOffsettedParabola(parabola, offset)
{
	
	clearCanvas();
	setCurrentColor(255,0,0,255);//set to red
	var initialParabola = parabolaBuffer[0];
	drawParabola(initialParabola.x, initialParabola.y, initialParabola.length);
	setCurrentColor(0,0,255,255);//set back to blue
	drawParabola(initialParabola.x+offset, initialParabola.y, initialParabola.length);
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
	if(curvesBuffer.length == 0)
	{
		console.log('Nothing to clear, curves buffer is empty.')
		return;
	}

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

	

	//change current pixel color to what was previously
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

function markPointAs(point,strValue)
{
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = "10px Arial";


    let x = point.x;
    let y = point.y;
    plotPixelAtXY(x,y);
    let str = "("+strValue+")";
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

	
	saveFrameBuffer();
	
	
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


	var ourParabola = new Parabola2D();
	ourParabola.x = centerX;
	ourParabola.y = centerY;
	ourParabola.length = length;

	parabolaBuffer.push(ourParabola);
	
	
	
	
	

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

function saveFrameBuffer()
{
	var currentFrameImageData = Gctx.getImageData(0,0, GcanvasWidth, GcanvasHeight);
	frameBuffer.push(currentFrameImageData);
	console.log('saved frame to buffer. Now framebuffer length is:'+frameBuffer.length);


}


function replaceWithPreviousFrameBuffer()//idea:find only the pixels which changed and then write only them onto the canvas. that would be super optimized.
{
	console.log('Entered replaceframebuffer method. Now framebuffer length is:'+frameBuffer.length);
	
	

	
	var index = frameBuffer.length - 1;
	inImageData = frameBuffer[index];

	if(inImageData)
		Gctx.putImageData(inImageData,0,0);
	frameBuffer.pop();
	console.log('exiting replaceFrambuffer(). replaced frame to buffer. Now framebuffer length is:'+frameBuffer.length);
	
}


function drawPolygon(points)
{
	//draw lines of each line in the polygon from index 0 to index n-1 
	for(var i = 0; i < points.length-1; i++)
	{
		var startPoint = points[i];
		var endPoint = points[i+1];
		drawDDALine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
		
	}

	//draw final line connecting endPoint to startPoint
	var startPoint = points[points.length-1];
	var endPoint = points[0];
	drawDDALine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);

	

	var polyObject = 
	{
		values: points,
		length: points.length
	}
	polygonBuffer.push(polyObject);
	console.log('polygon buffer:');
	console.log({polygonBuffer});

}

function scanlinePolygonFillAlgorithm(polyObject)
{
    var polyObject = polygonBuffer[0];
    var points = polyObject.values;
    var polyLength = polyObject.length;
    
    //task 1: find the topmost , bottommost , leftmost and rightmost vertices of the polygon    
    var topmostVertex = points[0];
    var bottomMostVertex = points[0];
    var leftmostVertex = points[0];
    var rightmostVertex = points[0];
    
    var nodeNames = ["A", "B", "C", "D", "E"];
    
    for(var i =0; i < polyLength; i++)
    {
        if(points[i].y < topmostVertex.y)
        {
            topmostVertex = points[i];
        }
        if(points[i].y > bottomMostVertex.y)
        {
            bottomMostVertex = points[i];
        }
        
        if(points[i].x < leftmostVertex.x)
        {
            leftmostVertex = points[i];
        }
        if(points[i].x > rightmostVertex.x);
        {
            rightmostVertex = points[i];
        }
        
        //now mark these points as A,B,C.. etc        
        markPointAs(points[i], nodeNames[i]);
    }
   
    
    var edge1 = new Edge2D();
    edge1.startPoint = points[0];
    edge1.endPoint = points[1];
    populateEdgeProperties(edge1);
    
    var edge2 = new Edge2D();
    edge2.startPoint = points[1];
    edge2.endPoint = points[2];    
    edge1.nextEdge = edge2;
    
    console.log('edge1:');
    console.log({edge1});
    var edgeList = [];
    
    //populate all edges from n=0 to n-1
    for(var i = 0; i < polyLength-1; i++)
    {
        var edge = new Edge2D();
        edge.startPoint = points[i];
        edge.endPoint = points[i+1]
        populateEdgeProperties(edge);
        edgeList.push(edge);
    }
    
    //now populate the final edge 
    var edge = new Edge2D();
    edge.startPoint = points[points.length-1];
    edge.endPoint = points[0];
    populateEdgeProperties(edge);
    edgeList.push(edge);
    
    //finally, assign the nextEdge value of Edge2D object
    for(var i = 0; i< edgeList.length-1; i++)
    {
        edgeList[i].nextEdge = edgeList[i+1];
    }
    edgeList[edgeList.length-1].nextEdge = edgeList[0];
    
    console.log('edgeList:');
    console.log({edgeList});
    
    ////////////////////////edge population completed/////////////////
    
    
    //TODO: find intersection point of two line segments
    
    var line1 = new Line2D();
    line1.x1 = edgeList[0].startPoint.x;
    line1.y1 = edgeList[0].startPoint.y;
    line1.x2 = edgeList[0].endPoint.x;
    line1.y2 = edgeList[0].endPoint.y;
    
    
    //choose a scanline where it surely intersects. say, its scanline#250
    var line2 = new Line2D();
    line2.x1 = 0;
    line2.y1 = 290;
    line2.x2 = GcanvasWidth;
    line2.y2 = 290;
    
    var c = getCurrentColor();
    setCurrentColor(255, 100,0, 255);
    
    
    var pt = new Point2D();
    pt.x = line1.x1;
    pt.y = line1.y1;
    markPointAs( pt, "(x1,y1)" );
    drawDDALine(line1.x1, line1.y1, line1.x2, line1.y2);
    var pt = new Point2D();
    pt.x = line2.x1;
    pt.y = line2.y1;
    markPointAs( pt, "(x2,y2)" );
    drawDDALine(line2.x1, line2.y1, line2.x2, line2.y2);
    
    
    //now lets check for intersection of line1 and line2
    
    var Xa = findIntersectionXCoordinateOf(line1, line2);
    console.log('Xa:'+ Xa);
    var point = new Point2D();
    point.x = Xa;
    point.y = line1.y1;
    markPoint(point);
    
    var pt = new Point2D();
    pt.x = Xa;
    pt.y = 290;
    markPoint(pt)
    
    
    


    
    
}

function findIntersectionXCoordinateOf(line1, line2)//if returns null, there is no intersection
{
//To check if two line segments intersect
//
//
//1. Check mutual interval existence
//2. Calculate values of A1, A2, b1, b2 and Xa
//3. Check that Xa is included in the mutual interval.
//

    var color = getCurrentColor();
    setCurrentColor(0,255,0, 255);
    console.log('inside findIntersection, changed color');
    

    
    class Interval2D
    {
        constructor(min,max)
        {
            this.min = min;
            this.max = max;
        }
    }
    //Segment1 = {(X1, Y1), (X2, Y2)}
    //Segment2 = {(X3, Y3), (X4, Y4)}
    
    var x1 = line1.x1;
    var x2 = line1.x2;
    var y1 = line1.y1;
    var y2 = line1.y2;
    
    var x3 = line2.x1;
    var x4 = line2.x2;
    var y3 = line2.y1;
    var y4 = line2.y2;
    
    
//    The abscissa Xa of the potential point of intersection (Xa,Ya) must be contained in both interval I1 and I2, defined as follow :
//
//    I1 = [min(X1,X2), max(X1,X2)]
//    I2 = [min(X3,X4), max(X3,X4)]
    
    
    //find the intervals
    var interval1 = new Interval2D();
    interval1.min = findMinimumOf(x1,x2);
    interval1.max = findMaximumOf(x1,x2);
    
    var interval2 = new Interval2D();
    interval2.min = findMinimumOf(x3,x4);
    interval2.max = findMaximumOf(x3,x4);
    
    console.log('interval1:');
    console.log(interval1);
    console.log('interval2:');
    console.log(interval2);
    
//    And we could say that Xa is included into :
//
//    Ia = [max( min(X1,X2), min(X3,X4) ),
//          min( max(X1,X2), max(X3,X4) )]

    
    //now, find if mutual interval exists
    if ((findMaximumOf(x1,x2) < findMinimumOf(x3,x4)) )
    {   //return false, there is no mutual abscissa
        return null;        
    }
    //so there is intersection, now find the intersected point's coordinate
    
//    So, we have two line formula, and a mutual interval. Your line formulas are:
//
//    f1(x) = A1*x + b1 = y
//    f2(x) = A2*x + b2 = y

    //or
    //   f1(x) = m1*x + b1 = y
    //or f2(x) = m2*x + b2 = y //where m is slope and b is y intercept
    
    
    var m1 = findSlope(line1);
    var m2 = findSlope(line2);
    var b1 = y1 - m1*x1;
    var b2 = y3 - m2*x3;
    
    console.log('m1:'+m1);
    console.log('m2:'+m2);
    console.log('b1:'+b1);
    console.log('b2:'+b2);
    
    //so now we have found m1, m2, b1, b2
    
    if(m1 == m2)//the slopes are same, means the lines are parallel, so no intersection
        return null;
    
    //A point (Xa,Ya) standing on both line must verify both formulas f1 and f2:
    //means
    //Ya = m1*Xa + b1 AND
    //Ya = m1*Xa + b2
    //=> m1*Xa + b1 = m2*Xa + b2
    //means our abscissa or the x intercept or Xa is
    // Xa = (b2-b1)/ (m1-m2)
    
    var Xa = Math.abs((b2-b1)/(m2-m1));//to avoid negative numbers in slope variables
    
    var min1 = findMinimumOf(x1,x2);
    var min2 = findMinimumOf(x3,x4);
    var max1 = findMaximumOf(x1,x2);
    var max2 = findMaximumOf(x3,x4);
    
    var p = findMaximumOf(min1, min2);
    var q = findMinimumOf(max1, max2);
    
    console.log('Xa:'+Xa);
    console.log('p:'+p);
    console.log('q:'+q);
    
    if( (Xa < p ) || (Xa > q) )
    {
        return -501; //intersection is not possible. its out of bounds
    }
    else
        return Xa;
    
    
}


function findMinimumOf(a,b)
{
    if(a < b)//no need to check for == or equal to because our reqmt is just to find the minimum
        return a;
    else
        return b;
    
}

function findMaximumOf(a,b)
{
    if(a > b)
        return a;
    else
        return b;
}

function populateEdgeProperties(edge)
{
    var startX = edge.startPoint.x;
    var startY = edge.startPoint.y;
    var endX = edge.endPoint.x;
    var endY = edge.endPoint.y;
    
    var dx = endX - startX;
    var dy = endY - startY;
    
     //next find m (slope) of the line
    var m = dy/dx;
    edge.slope = m;
    
    var steps = 0;
    if(startY > endY)
        edge.yUpper = endY;
    else
        edge.yUpper = startY;
    
    var intercepts = [];   
    
    
    //choose the longest as the parameter for stepping one by one
    if(Math.abs(dy) > Math.abs(dx))
    {
        steps = dy;
        console.log('vertical length is bigger than horizontal');
        outputToDebugWindow('vertical bigger');
        var point = new Point2D();
        point.x = startX;
        point.y = startY;
        intercepts.push(point);
        
        var previousYIntercept = startY;        
        edge.scanSteps = m;
        edge.slanting = "verticalSlant";
        
        
        for(var i = 0; i < steps; i++)
        {
            point = new Point2D();
            point.x = startX + i;
            point.y = previousYIntercept + m;//find the intercept;
            intercepts.push(point);
            previousYIntercept = point.y;
        }
    }
    else 
    {
        console.log('horizontal length is bigger than vertical');
        outputToDebugWindow('horizontal bigger');
        steps = dx;
        var point = new Point2D();
        point.x = startX;
        point.y = startY;
        intercepts.push(point);
        
        var previousXIntercept = startX;
        edge.scanSteps = 1/m;
        edge.slanting = "horizontalSlant";
        
        for(var i = 0; i < steps; i++)
        {
            point = new Point2D();
            point.x = previousXIntercept + (1/m); //find the intercept
            point.y = startY + i;
            intercepts.push(point);
            previousXIntercept = point.x;
        }
    }
    
    edge.intercepts = intercepts;
    
    
    
    
}

function outputToDebugWindow(strValue, linebreak = true)
{
    const debugWindow = document.querySelector('#debugParagraph');
    var str  = debugWindow.innerHTML;;
    str = str + strValue;
    if(linebreak)
        debugWindow.innerHTML = str+'</br>';
    else
        debugWindow.innerHTML = str;
    
}

function findAllInterceptsOfEdge(edge)
{
    var startX = edge.startPoint.x;
    var startY = edge.startPoint.y;
    var endX = edge.endPoint.x;
    var endY = edge.endPoint.y;
    var dx = endX - startX;
    var dy = endY - startY;
    
    var intercepts = [];
    
    
    
    
    //next find m (slope) of the line
    var m = dy/dx;
    var steps = 0;
    
    //choose the longest as the parameter for stepping one by one
    if(Math.abs(dy) > Math.abs(dx))
    {
        steps = dy;
        console.log('vertical length is bigger than horizontal');
        outputToDebugWindow('vertical bigger');
        var point = new Point2D();
        point.x = startX;
        point.y = startY;
        intercepts.push(point);
        
        var previousYIntercept = startY;
        for(var i = 0; i < steps; i++)
        {
            point = new Point2D();
            point.x = startX + i;
            point.y = previousYIntercept + m;//find the intercept;
            intercepts.push(point);
            previousYIntercept = point.y;
        }
    }
    else 
    {
        console.log('horizontal length is bigger than vertical');
        outputToDebugWindow('horizontal bigger');
        steps = dx;
        var point = new Point2D();
        point.x = startX;
        point.y = startY;
        intercepts.push(point);
        
        var previousXIntercept = startX;
        for(var i = 0; i < steps; i++)
        {
            point = new Point2D();
            point.x = previousXIntercept + (1/m); //find the intercept
            point.y = startY + i;
            intercepts.push(point);
            previousXIntercept = point.x;
        }
    }
    
    return intercepts;
    
    
    
    
    
}

function drawGrid()
{
    var currentColor =  getCurrentColor();
    
    setCurrentColor(0,0,0,20);
    for(var i = 0; i < GcanvasWidth; i++)
    {
        if(i%10==0)
        {
            drawDDALine(i, 0, i, GcanvasHeight);
        }
    }
    
    for(var i = 0; i < GcanvasHeight; i++)
    {
        if(i%10==0)
        {
            
            drawDDALine(0,i, GcanvasWidth, i );
        }
    }
    
    setCurrentColor(currentColor);
    
    
}


function drawScreen()
{
	console.log('Script loaded: true');
	initCanvas();
	clearCanvas();
	// saveFrameBuffer();
	
        drawGrid();	
	var startTime = Date.now();	
	setCurrentColor(0,0,255,255);

	var pointsArray = [];
	var point = new Point2D();//1
	point.x = 120;
	point.y = 100;
	pointsArray.push(point);

	point = new Point2D();//2
	point.x = 180;
	point.y = 170;
	pointsArray.push(point);

	point = new Point2D();//3
	point.x = 330;
	point.y = 120;
	pointsArray.push(point);

	point = new Point2D();//4
	point.x = 350;
	point.y = 270;
	pointsArray.push(point);

	point = new Point2D();//5
	point.x = 160;
	point.y = 350;
	pointsArray.push(point);	

//	console.log(pointsArray);
//	drawPolygon(pointsArray);//draws the polygon
//        scanlinePolygonFillAlgorithm(polygonBuffer[0]);//scanline polygon filling algorithm
        
        pointsArray = [];
        var point = new Point2D();
        point.x = 200;
        point.y = 200;
        pointsArray.push(point);
        
        var point = new Point2D();
        point.x = 140;
        point.y = 350;
        pointsArray.push(point);
        
        var point = new Point2D();
        point.x = 260;
        point.y = 350;
        pointsArray.push(point);
        drawPolygon(pointsArray);//draws the polygon
        scanlinePolygonFillAlgorithm(polygonBuffer[polygonBuffer.length-1]);//scanline polygon filling algorithm
        
        

	

	var endTime = Date.now();
	var elapsedTime = endTime-startTime;
	console.log('Time taken for drawing ellipse :'+elapsedTime+' milliseconds');

	
	const debugWindow = document.querySelector('#debugParagraph');
	// debugWindow.innerHTML = `x1:${x1}, y1:${y1},</br> x2:${x2}, y2:${y2}`;
        outputToDebugWindow("hey there");
        outputToDebugWindow("Line 2 ", false);
        outputToDebugWindow("Line 3", false);
}


window.onload = drawScreen;
