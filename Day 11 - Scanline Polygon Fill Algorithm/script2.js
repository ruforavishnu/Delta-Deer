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

function ifBLiesOnSegmentAC(a,b,c)
{
    if(b.x <= Math.max(a.x,c.x) 
    && b.x >= Math.min(a.x,c.x)
    && b.y <= Math.max(a.y,c.y)
    && b.y >= Math.min(a.y, c.y))
   {
       return true;
   }
   else
       return false;
}

function getOrientation(a,b,c)
{
    var orientation = ["collinear", "clockwise", "anticlockwise"];
    var val = (b.y - a.y) * (c.x-b.x) - (b.x - a.x)* (c.y - b.y);
    
    if(val == 0)
        return orientation[0];
    
    if(val > 0 )
        return orientation[1];
    else
        return orientation[2]
        
}

function ifIntersects(a,b,c,d)
{
    var o1 = getOrientation(a,b,c);
    var o2 = getOrientation(a,b,d);
    var o3 = getOrientation(c,d,a);
    var o4 = getOrientation(c,d,b);
    
    if(o1 != o2 && o3!=o4)
        return true;
    
    if(o1 == 0 && ifBLiesOnSegmentAC(a,c,b))
        return true;
    if(o2 == 0 && ifBLiesOnSegmentAC(a,d,b))
        return true;
    if(o1 == 0 && ifBLiesOnSegmentAC(c,a,d))
        return true;
    if(o1 == 0 && ifBLiesOnSegmentAC(c,b,d))
        return true;
    
    return false;
}



function scanlinePolygonFillAlgorithm(polyObject)
{
    var points = polyObject.values;
    var polyLength = polyObject.length;
    
    console.log('polyObject');
    console.log({polyObject});
    
    var boundaryPoints = findBoundingRect(points);
    var edgeList = populateEdgeProperties(points);
    console.log('edgeList');
    console.log({edgeList});
    
    createScanlines(boundaryPoints, edgeList);
    
}

function populateEdgeProperties(points)
{
    var edgeList = [];
    for(var i = 0; i < points.length - 1; i++)//do for all edges from n = 0 to n = length-1
    {
        var edge = new Edge2D();
        edge.startPoint = new Point2D();
        edge.startPoint.x = points[i].x;
        edge.startPoint.y = points[i].y;
        edge.endPoint = new Point2D();
        edge.endPoint.x = points[i+1].x
        edge.endPoint.y = points[i+1].y;
        
        edgeList.push(edge);
    }
    //now do for the final edge
    var edge = new Edge2D();
    edge.startPoint = new Point2D();
    edge.startPoint.x = points[points.length-1].x;
    edge.startPoint.y = points[points.length-1].y;
    edge.endPoint = new Point2D();
    edge.endPoint.x = points[0].x;
    edge.endPoint.y = points[0].y;
    edgeList.push(edge);
    
     
    var alphabetString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    for(var i = 0; i < edgeList.length; i++)
    {
        var edge = edgeList[i];
        var startX = edge.startPoint.x;
        var startY = edge.startPoint.y;
        var endX = edge.endPoint.x;
        var endY = edge.endPoint.y;
        
        edge.yUpper = edge.startPoint.y;
        if(edge.startPoint.y > edge.endPoint.y )//no need to check for else condition here
            edge.yUpper = edge.endPoint.y;
        
        //next find m (slope) of the line
        var dy = edge.endPoint.y - edge.startPoint.y;
        var dx = edge.endPoint.x - edge.startPoint.x;
        var m = dy/dx;
        edge.slope = m;
        
        if(Math.abs(dy)>Math.abs(dx))
            edge.slanting = "VerticaSllant";
        else
            edge.slanting = "HorizontalSlant";

        edge.scanSteps = -1;//not used , delete this variable later 
        
        var coordinatesList = [];
        var steps = (Math.abs(dx) > Math.abs(dy) ) ? Math.abs(dx) : Math.abs(dy);
        const xInc = dx/ parseFloat(steps);
	const yInc = dy/ parseFloat(steps);
        
        let x = startX;
        let y = startY;
        
        for(var j = 0; j <= steps; j++ )
        {
            var point = new Point2D();
            point.x = x;
            point.y = y;
            coordinatesList.push(point);
            x+=xInc;
            y+=yInc;
        }
        edge.intercepts = coordinatesList;
        edge.nextEdge = null;
        edge.prevEdge = null;
        
        if(i < edgeList.length-1)
        {
            var str = ""+ alphabetString[i]+ alphabetString[i+1];
            edge.edgeName = str;
        }
        else
        {
            var str = ""+ alphabetString[i] + alphabetString[0];
            edge.edgeName = str;
        }
        
        if(i > 26)
            console.err('Polygon edge count > 26, so edgeName value will product error');
        
    }
    var nextEdge = null
    var prevEdge = null;
    
    for(var i = 1; i < edgeList.length - 1; i++)
    {
        var edge = edgeList[i];
        nextEdge = edgeList[i+1];
        prevEdge = edgeList[i-1];
        edge.nextEdge = nextEdge;
        edge.prevEdge = prevEdge;
    }
    var edge = edgeList[0];//first edge
    nextEdge = edgeList[1];
    prevEdge = edgeList[edgeList.length-1];
    edge.nextEdge = nextEdge;
    edge.prevEdge = prevEdge;
    
    
    edge = edgeList[edgeList.length-1];//last edge
    nextEdge = edgeList[0];
    prevEdge = edgeList[edgeList.length-2];
    edge.nextEdge = nextEdge;
    edge.prevEdge = prevEdge;
    
    return edgeList;
}

function createScanlines(boundaryPoints, edgeList)
{
    var topMostVertex = new Point2D();
    topMostVertex.x = 0;
    topMostVertex.y = boundaryPoints[0].y;
    var bottomMostVertex = new Point2D();
    bottomMostVertex.x = 0;
    bottomMostVertex.y = boundaryPoints[2].y;
    
    var color = getCurrentColor();
    setCurrentColor(0,255,0,155);
    drawDDALine(0, topMostVertex.y, GcanvasWidth, topMostVertex.y);
    drawDDALine(0, bottomMostVertex.y, GcanvasWidth, bottomMostVertex.y);
    setCurrentColor(color[0],color[1],color[2],color[3]);
    
    var scanlineList = [];
    var index = 0;
    var intersectedPointsList = [];
    console.log('Starting to calculate scanline intersections ');
    for(var i = topMostVertex.y; i < bottomMostVertex.y; i++)
    {
        var sline = new ScanLine();
        sline.index = index;
        ++index;
        intersectedPointsList = [];
        var scanlineSegment = new Line2D();
        scanlineSegment.x1 = 0;
        scanlineSegment.y1 = i;
        scanlineSegment.x2 = GcanvasWidth;
        scanlineSegment.y2 = i;
        var scanlineStartPoint = new Point2D();
        var scanlineEndPoint = new Point2D();
        scanlineStartPoint.x = scanlineSegment.x1;
        scanlineStartPoint.y = scanlineSegment.y1;
        scanlineEndPoint.x = scanlineSegment.x2;
        scanlineEndPoint.y = scanlineSegment.y2;
        
        //now populate all scanline values. for each edge in edgeList check if the scanline intersects with the edge.
        
        for(var j = 0; j < edgeList.length; j++)
        {
            var edge = edgeList[j];
            
            ifIntersects(edge.startPoint, edge.endPoint , scanlineStartPoint, scanlineEndPoint )
            {
                //find intersection point and push it in ScanLine objects intersectionList array
                var intersectionPoint = new Point2D();
                intersectionPoint = getLineSegmentIntersectionPoint(edge.startPoint, edge.endPoint , scanlineStartPoint, scanlineEndPoint );
                intersectedPointsList.push(intersectionPoint);
            }
        }
        sline.intersectionList = intersectedPointsList;
        scanlineList.push(sline);
        
        
    }
    console.log('Completed calculating scanline intersections ');
    
    console.log('Intersection Points List:');
    console.log({intersectedPointsList});
    
    console.log('Scanline List:');
    console.log({scanlineList});
    
    for(var k = 0; k < scanlineList.length; k++)
    {
        if(k%50 == 0)
        {   
            console.log('k mod 25 is equal to true');
            var intersectionPoints = scanlineList[k].intersectionList;
            for(var m = 0; m < intersectionPoints.length; m++)
            {
                var point = intersectionPoints[m];
                var strVal = "K"+k+ "_A"+m;
                
                markPointAs(point,strVal);
            }
            
        }
    }
    
    
}

function getLineSegmentIntersectionPoint(p1,p2, p3, p4)
{
    var x1 = p1.x;
    var y1 = p1.y;
    var x2 = p2.x;
    var y2 = p2.y;
    var x3 = p3.x;
    var y3 = p3.y;
    var x4 = p4.x;
    var y4 = p4.y;
    
       
    var A1 = y2 - y1;
    var B1 = x1 - x2;
    var C1 = (A1*x1) + (B1*y1);
    
    var A2 = y4-y3;
    var B2 = x3-x4;
    var C2 = (A2*x3) + (B2*y3);
    
    var det = (A1*B2) - (A2*B1);
    
    if(Math.round(det)=== 0)
    {
        //lines are parallel
        console.log('lines are parallel, exiting');
        return;
    }
    else
    {
        var x = ((B2 * C1) - (B1*C2))/det;
        var y = ( (A1*C2) - (A2*C1))/det;
        
        var intersectionPoint = new Point2D();
        intersectionPoint.x = x;
        intersectionPoint.y = y;
        console.log('intersection point is:'+ {intersectionPoint});
        return intersectionPoint;
    }
    
    
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

