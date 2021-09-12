



function scanlinePolygonFillAlgorithm(polyObject)
{
    
    var points = polyObject.values;
    var polyLength = polyObject.length;
    var scanlineList = [];
    
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
    
   
    var edgeList = [];
    for(var i = 0; i < polyLength-1; i++)    //populate all edges from n=0 to n-1
    {
        var edge = new Edge2D();
        edge.startPoint = points[i];
        edge.endPoint = points[i+1]
        populateEdgeProperties(edge);
        edgeList.push(edge);
    }
    
    var edge = new Edge2D();//now populate the final edge 
    edge.startPoint = points[polyLength-1];
    edge.endPoint = points[0];
    populateEdgeProperties(edge);
    edgeList.push(edge);
    
    var edgeNames = ["AB", "BC", "CD", "DE", "EA"];
    //finally, assign the nextEdge value of Edge2D object
    for(var i = 0; i< edgeList.length-1; i++)
    {
        edgeList[i].nextEdge = edgeList[i+1];
        edgeList[i].edgeName = edgeNames[i];
    }
    edgeList[edgeList.length-1].nextEdge = edgeList[0];
    edgeList[edgeList.length-1].edgeName = "EA";
    
    console.log('edgeList:');
    console.log({edgeList});
    console.log('polyObject.values');
    console.log({polyObject});
    
    
    
    //debug-code-starts/////////////////
    //plot a circle in between all the edges, we can see if the problem has already started.
    for(var i = 0; i < edgeList.length; i++)
    {
        var edge = edgeList[i];
        var midPoint = new Point2D();
        midPoint.x = (edge.startPoint.x+ edge.endPoint.x)/2 + 0;
        midPoint.y = (edge.startPoint.y + edge.endPoint.y)/2;
        drawMidpointCircle(midPoint.x, midPoint.y , 5);
        var str = edge.edgeName;
        markPointAs(midPoint, str);
    }
    //debug-code-ends//////////////////
    
//    return;

    ////////////////////////edge population completed/////////////////
    ////////////////////////////now find the intersection point of each edge with each scanline///////////
    
    
    
    var yCoordinate = -1;//to keep track of the y coordinate 
    for(var i = topmostVertex.y; i < bottomMostVertex.y; i++)
    {
        yCoordinate++;
        //for each scan line check if the scanline intersects with each edge in our edgeList
        var scanline = new Line2D();
        scanline.x1 = 0;
        scanline.y1 = i;
        scanline.x2 = GcanvasWidth;
        scanline.y2 = i;
        
        //now, loop through all edges in the edgeList
        var scanRow = new ScanlineValue();
        scanRow.index = i;    
        scanRow.intersectionList = [];
        
        var paintedEdge = [];
        //debug-code-start//////////////////
        var color = getCurrentColor();
        setCurrentColor(128,0,128,255);
        for(var k = 0; k < 5; k++)//drawing the same polygon translated 230pixels right for debug purposes
        {
            var ourEdge = edgeList[k];
            paintedEdge.push(ourEdge.edgeName);
            //now create a line segment out of that edge for easier calculations
            var line = new Line2D();
            line.x1 = ourEdge.startPoint.x;
            line.y1 = ourEdge.startPoint.y;
            line.x2 = ourEdge.endPoint.x;
            line.y2 = ourEdge.endPoint.y;
            
            drawDDALine(line.x1 + 230, line.y1, line.x2 + 230, line.y2);
        }
        setCurrentColor(color[0],color[1], color[2], color[3]);
        
        
        //debug-code-end///////////////////
        
        scanlineList.push(scanRow);
        
    }
//    return;
    
    console.log('Scanline List, before sorting:');
    console.log(scanlineList);
    console.log('paintedEdge');
    console.log({paintedEdge});
    
    
//    return;
////////////////now we need to sort the values of intersectionList[] in ascending order/////////

        for(var i = 0; i < scanlineList.length ; i++)
        {
//            var scanLine = scanlineList[i];
//            var iList = scanLine.intersectionList;//this contains our list of coords
//            var index = scanLine.index;
//            
            scanlineList[i].intersectionList.sort(function(a,b) {
               if(a.x > b.x) 
                   return 1;
               else 
                   return -1;
            });
            
        }
        
        console.log('Scanline List, after sorting:');
        console.log(scanlineList);
        
        return;
        
////////////finished sorting////////////////////////////////


        
        for(var i = 0; i < scanlineList.length; i++)
        {    
            var scanrow = scanlineList[i];
            console.log({scanrow});
            var intercepts = [];
            intercepts = scanrow.intersectionList;
            
            for(var j = 0; j < intercepts.length; j+=2)
            {
                if(intercepts[j+1]  && intercepts.length %2 === 0)//if the object exists and is not null
                {
                    var startPoint = new Point2D();
                    var endPoint = new Point2D();

                    startPoint.x = intercepts[j].x;
                    startPoint.y = intercepts[j].y;
                    endPoint.x = intercepts[j+1].x;
                    endPoint.y = intercepts[j+1].y                    

                    drawDDALine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
                    
                }
                else if( sortediList.length %2 === 1)//its odd
                {
                    console.log('else if condition invoked at j:'+j);
                    console.log('sortediList:');
                    console.log({sortediList});
                }
                else
                {
                    console.log('else condition invoked at j:'+j);
                    console.log('sortediList:');
                    console.log({sortediList});
                }
            }
        }
        
        
       
    
    
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
    
//    console.log('interval1:');
//    console.log(interval1);
//    console.log('interval2:');
//    console.log(interval2);
//    
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
    
//    console.log('m1:'+m1);
//    console.log('m2:'+m2);
//    console.log('b1:'+b1);
//    console.log('b2:'+b2);
//    
    //so now we have found m1, m2, b1, b2
    
    if(m1 === m2)//the slopes are same, means the lines are parallel, so no intersection
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
    
    
    if( (Xa < p ) || (Xa > q) )
        return -501; //intersection is not possible. its out of bounds
    else
        return Xa;
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
        steps = dx;
        var point = new Point2D();
        point.x = startX;
        point.y = startY;
        intercepts.push(point);
        
        var previousXIntercept = startX;
        edge.scanSteps = 1/m;
        edge.slanting = "horizontalSlant";
        
        var xStep = 1/m;
        if(m === 0 || m === NaN)
        {
            xStep = 1;
        }
        for(var i = 0; i < steps; i++)
        {
            point = new Point2D();
            point.x = previousXIntercept + xStep; //find the intercept
            point.y = startY + i;
            intercepts.push(point);
            previousXIntercept = point.x;
        }
    }
    edge.intercepts = intercepts;
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
	drawPolygon(pointsArray);//draws the polygon
        scanlinePolygonFillAlgorithm(polygonBuffer[0]);//scanline polygon filling algorithm
        
	var endTime = Date.now();
	var elapsedTime = endTime-startTime;
	console.log('Time taken for drawing screen :'+elapsedTime+' milliseconds');
	const debugWindow = document.querySelector('#debugParagraph');
}


window.onload = drawScreen;
