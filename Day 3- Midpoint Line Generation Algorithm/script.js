

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
    imageData.data[3] = 255;
    
    var r = 255;
    var g = 0;
    var b = 0;
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


}

function drawBresenhamLine(x1,y1, x2,y2)
{
	/*
	** This bresenham algorithm will only work for first octant. (not quadrant, but octant)
	** ie. for 0 < m < 1
	*/

	const dx = x2-x1;
	const dy = y2 - y1;
	let x = x1;
	let y = y1;
	let p = 2*dy - dx;


	while(x < x2)
	{
		if(p >= 0)
		{
			plotPixelAtXY(x,y);
			y+=1;
			p = p + 2*dy - 2*dx;

		}
		else
		{
			plotPixelAtXY(x,y);
			p = p + 2*dy;
			x+=1;
		}
	}
}

function drawMidpointLineAlgorithm(x1,y1, x2,y2)
{
	const dx = x2-x1;
	const dy = y2-y1;

	let d = dy - (dx/2);
	let x = x1;
	let y = y1;

	while(x < x2)
	{
		x+=1;

		if(d < 0 )
		{
			d = d+dy;
		}
		else
		{
			d = d + (dy - dx);
			y+=1;
		}
		plotPixelAtXY(x,y);

	}
}

function drawScreen()
{
	console.log('Script loaded: true');
	initCanvas();
	clearCanvas();
	// drawDDALine(100,100,500,300);

	const debugWindow = document.querySelector('#debugParagraph');

	debugWindow.innerHTML = "x1:30, y1: 20, x2:250, y2:160";
	let x1 = 100;
	let y1 = 100;
	let x2 = 350;
	let y2 = 350;

	drawMidpointLineAlgorithm(x1,y1, x2,y2);
	debugWindow.innerHTML = `x1:${x1}, y1:${y1},</br> x2:${x2}, y2:${y2}`;
}


window.onload = drawScreen;
