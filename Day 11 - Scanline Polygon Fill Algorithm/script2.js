/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class ScanLine
{
    constructor(index, intersectionList)
    {
        this.index = index;
        this.intersectionList = intersectionList;
    }
}



function scanlinePolygonFillAlgorithm(polyObject)
{
    var points = polyObject.values;
    var polyLength = polyObject.length;
    
    console.log('polyObject');
    console.log({polyObject});
    
    var boundaryPoints = findBoundingRect(points);
    
    createScanlines(boundaryPoints);
    
}

function createScanlines(boundaryPoints)
{
    var topMostVertex = new Point2D();
    topMostVertex.x = boundaryPoints[0].x;
    topMostVertex.y = boundaryPoints[0].y;
    var bottomMostVertex = new Point2D();
    bottomMostVertex.x = boundaryPoints[2].x;
    bottomMostVertex.y = boundaryPoints[2].y;
    
    var color = getCurrentColor();
    setCurrentColor(0,255,0,155);
    drawDDALine(0, topMostVertex.y, GcanvasWidth, topMostVertex.y);
    drawDDALine(0, bottomMostVertex.y, GcanvasWidth, bottomMostVertex.y);
    setCurrentColor(color[0],color[1],color[2],color[3]);
    
    
}


function findBoundingRect(polygonPoints)
{
    var boundaryPoints = [];
    var topLeftVertex = new Point2D();
    var topRightVertex = new Point2D();
    var bottomLeftVertex = new Point2D();
    var bottomRightVertex = new Point2D();
    
    var leftmost = polygonPoints[0].x;
    var rightmost = polygonPoints[0].x;
    var topmost = polygonPoints[0].y;
    var bottommost = polygonPoints[0].y;
    for(var i = 0; i < GcanvasWidth; i++)
    {
        if(polygonPoints[i])//this check is important because we need to check only where the point exist and is not null
        {    
            if(polygonPoints[i].x < leftmost)
                leftmost = polygonPoints[i].x;
            if(polygonPoints[i].x > rightmost)
                rightmost = polygonPoints[i].x;
        }
    }
    
    for(var i = 0; i< GcanvasHeight; i++)
    {
        if(polygonPoints[i])//this check is important because we need to check only where the point exist and is not null
        {    
            if(polygonPoints[i].y < topmost)
                topmost = polygonPoints[i].y;
            if(polygonPoints[i].y > bottommost)
                bottommost = polygonPoints[i].y;
        }
    }
    
    var currentColor = getCurrentColor();//save current color
    setCurrentColor(128,0,128,170);
    
    drawDDALine(leftmost, topmost, rightmost, topmost);
    drawDDALine(leftmost, topmost, leftmost, bottommost);
    drawDDALine(rightmost, topmost, rightmost, bottommost);
    drawDDALine(leftmost, bottommost, rightmost, bottommost);
    
    topLeftVertex.x = leftmost;
    topLeftVertex.y = topmost;
    topRightVertex.x = rightmost;
    topRightVertex.y = topmost;
    bottomLeftVertex.x = leftmost;
    bottomLeftVertex.y = bottommost;
    bottomRightVertex.x = rightmost;
    bottomLeftVertex.y = bottommost;
    
    setCurrentColor(currentColor[0], currentColor[1], currentColor[2], currentColor[3]);//change to previous saved color
    boundaryPoints.push(topLeftVertex, topRightVertex, bottomLeftVertex, bottomRightVertex);
    return boundaryPoints;
}


function drawScreen()
{
	console.log('Script loaded: true');
	initCanvas();
	clearCanvas();
	
        drawGridWithMarkers();	
	var startTime = Date.now();	
	setCurrentColor(0,0,255,255);

	var pointsArray = [];
	var point = new Point2D();//1
	point.x = 120;
	point.y = 110;
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
	point.x = 370;
	point.y = 270;
	pointsArray.push(point);

	point = new Point2D();//5
	point.x = 160;
	point.y = 370;
	pointsArray.push(point);	
	drawPolygon(pointsArray);//draws the polygon
        scanlinePolygonFillAlgorithm(polygonBuffer[0]);//scanline polygon filling algorithm
        
	var endTime = Date.now();
	var elapsedTime = endTime-startTime;
	console.log('Time taken for drawing screen :'+elapsedTime+' milliseconds');
	const debugWindow = document.querySelector('#debugParagraph');
}


window.onload = drawScreen;

