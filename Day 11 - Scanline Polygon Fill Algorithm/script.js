

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
    
  
    
    ////////////////////////////now find the intersection point of each edge with each scanline///////////
    
    var scanlineList = [];
    
    class ScanlineValue
    {
        constructor(index, intersectionList)
        {
            this.index = index;
            this.intersectionList = intersectionList;
        }
    }
    
    var yCoordinate = 0;//to keep track of the y coordinate 
    console.log('edgeList length:'+edgeList.length);
    for(var i = topmostVertex.y; i < bottomMostVertex.y; i++)
    {
        //for each scan line check if the scanline intersects with each edge in our edgeList
        var scanline = new Line2D();
        scanline.x1 = 0;
        scanline.y1 = i;
        scanline.x2 = GcanvasWidth;
        scanline.y2 = i;
        
        //now, loop through all edges in the edgeList
        var scanRow = new ScanlineValue();
        scanRow.index = yCoordinate;    
        scanRow.intersectionList = [];
        
        //debug-code-start//////////////////
        for(var k = 0; k < 5; k++)
        {
            var ourEdge = edgeList[k];
            
            //now create a line segment out of that edge for easier calculations
            var line = new Line2D();
            line.x1 = ourEdge.startPoint.x;
            line.y1 = ourEdge.startPoint.y;
            line.x2 = ourEdge.endPoint.x;
            line.y2 = ourEdge.endPoint.y;
            
            drawDDALine(line.x1 + 230, line.y1, line.x2 + 230, line.y2);
            
            
        }
        //debug-code-end///////////////////
        
        for(var j = 0; j < edgeList.length ; j++)
        {
            var ourEdge = edgeList[j];
            
            //now create a line segment out of that edge for easier calculations
            var line = new Line2D();
            line.x1 = ourEdge.startPoint.x;
            line.y1 = ourEdge.startPoint.y;
            line.x2 = ourEdge.endPoint.x;
            line.y2 = ourEdge.endPoint.y;
            
//            //debug-code-start//////////////////
//            drawDDALine(line.x1 + 230, line.y1, line.x2 + 230, line.y2);
//            //debug-code-end///////////////////
//            
            
            //so, now we have both scanline and the line segment/edge of whose intersection point we need to find
            var Xa = findIntersectionXCoordinateOf(scanline, line);
            
            if(Xa != null && Xa != -501)
            {
                
                var pt = new Point2D();
                pt.x = Xa;
                pt.y = topmostVertex.y + yCoordinate;
                scanRow.intersectionList.push(pt);
                
                
                //debug-code-start/////////////
                drawMidpointCircle(pt.x+230, pt.y, 3);
                //debug-code-end///////////////
            }
            else
            {
//                console.log('Scan line did not intersect with the line at yCoordinate: '+yCoordinate);
            }
        }
        
        scanlineList.push(scanRow);
        yCoordinate++;
        
    }
    
    console.log('Scanline List:');
    console.log(scanlineList);
    
    ////////////////now we need to sort the values of intersectionList[] in ascending order/////////
    
    //the following has to be deleted and written for a polygon with n vertices///
    ////before that lets try painting the fillPoly since now we have just 3 points in the triangel////
    
//    var color = getCurrentColor();
//    setCurrentColor(0,255,0,255);
//    
//    for(var i = 0; i < scanlineList.length; i++)
//    {
//        var scanLine = scanlineList[i];
//        
//        var line1 = new Line2D();
//        var pt1 = scanLine.intersectionList[0];
//        var pt2 = scanLine.intersectionList[1];
//        
//        
//        console.log('Drawing line from ');
//        console.log(pt1);
//        console.log('to point');
//        console.log(pt2);
////        markPointAs(pt1, "Pt1");
////        markPointAs(pt2, "Pt2");
//        drawDDALine(pt1.x, pt1.y, pt2.x, pt2.y);
//        
//    }
//    
//    setCurrentColor(color[0], color[1], color[2], color[3]);

////////////////now we need to sort the values of intersectionList[] in ascending order/////////

        for(var i = 0; i < scanlineList.length; i++)
        {
            var scanLine = scanlineList[i];
            var iList = scanLine.intersectionList;//this contains our list of coords
            var index = scanLine.index;
            var sortediList = iList.sort(function(a,b) {
               if(a.x > b.x) 
                   return 1;
               else 
                   return -1;
            });
            
            for(var j = 0; j < sortediList.length; j+=2)
            {
                
                if(index > 0 && index < 190)
                {
                    if(sortediList[j+1] )
                    {
                        var startPoint = new Point2D();
                        var endPoint = new Point2D();

                        startPoint.x = sortediList[j].x;
                        startPoint.y = sortediList[j].y;
                        endPoint.x = sortediList[j+1].x;
                        endPoint.y = sortediList[j+1].y                    

                        drawDDALine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);

                    }
                }
                
                else
                {
                    if(sortediList[j+2] )
                    {
                        var startPoint = new Point2D();
                        var endPoint = new Point2D();

                        startPoint.x = sortediList[j].x;
                        startPoint.y = sortediList[j].y;
                        endPoint.x = sortediList[j+1].x;
                        endPoint.y = sortediList[j+1].y                    

                        drawDDALine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);

                    }
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
    
//    console.log('Xa:'+Xa);
//    console.log('p:'+p);
//    console.log('q:'+q);
    
    if( (Xa < p ) || (Xa > q) )
    {
        return -501; //intersection is not possible. its out of bounds
    }
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

//	console.log(pointsArray);
	drawPolygon(pointsArray);//draws the polygon
        scanlinePolygonFillAlgorithm(polygonBuffer[0]);//scanline polygon filling algorithm
        
//        pointsArray = [];
//        var point = new Point2D();
//        point.x = 200;
//        point.y = 200;
//        pointsArray.push(point);
//        
//        var point = new Point2D();
//        point.x = 140;
//        point.y = 350;
//        pointsArray.push(point);
//        
//        var point = new Point2D();
//        point.x = 260;
//        point.y = 350;
//        pointsArray.push(point);
//        drawPolygon(pointsArray);//draws the polygon
//        scanlinePolygonFillAlgorithm(polygonBuffer[polygonBuffer.length-1]);//scanline polygon filling algorithm
        
        

	

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
