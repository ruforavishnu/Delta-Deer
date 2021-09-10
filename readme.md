Project Delta Deer - Writing computer graphics algorithms in javascript so that they can be used as a library later on.

Time spent: 30+10+80+335+480+10+30+30+180+60+90+15+60 mins
or 1480 mins
or 23 hours 0 mins

Changes are written in chronological order, so latest commit details are at the end of the file.


Commit#1 

Note: Committing all local development files to github

Things learnt:
1. Wrote DDA line drawing algorithm in Javascript
2. Wrote Bresenham line drawing algorithm in Javascript
3. Wrote Midpoint Line Drawing Algorithm in Javascript

Commit#2 

Note:

1. Writing parallel line algorithm
2. Created a new class Line2D to store 2 point coordinates.


Commit#3

Note:
1. Parallel line drawing code more optimized.

Commit#4
Time taken:

1. Wrote code to display line coordinates at endpoints 
2. Wrote code to display line slope at endpoints

Commit#5

1. Corrected today's time taken value in readme.md


Commit#6 
1. Learned how to animate a line from one endpoint to another


Commit#7 - Day 5 - Midpoint Circle Drawing Algorithm
Time taken: 55mins

1. Learnt how to draw all 8 octancts of an arc therby making it a circle.


Commit#8 - Day 6 - Midpoint Ellipse Drawing Algorithm
Time taken: 30 mins
1. Learnt how to draw an ellipse with both major axis and minor axis.


Commit#9 - Day 7 - Draw Parabola && Day 8 - Draw Hyperbola completed
1. Learnt how to plot a parabola
2. Learnt how to plot an advanced parabola with parameters a and b ( b.y = a.x² format )
3. Learnt how to plot a hyperbola

Commit#10 - Code for Previous parabola erase figured out and written

1. Wrote code to erase the previous curve one by one. Works only for parabola now, need to extend it to all curves later.


Commit#11

1. Writing code to save frameBuffer when objects are drawn and saving it to a list 
2. And when needed, write the values of the frameBuffer onto screen. Means writing the entire frame to canvas.


Commit#12 
1. Updated exact time spent today.

Commit#13
Time spent: 10 mins
1. Figuring out how to draw the saved buffer back on screen.


Commit#14
Time spent : 30 mins

1. Figured out how to paint to canvas
2. Also, figuring out erase canvas to just previous frame from framebuffer.


Commit#15
Time spent: 30mins
1. Parallel curve drawing algorithm for Parabola figured out and coded. Next need to write for advanced parabola, hyperbola. It might seem difficult figuring out these pixel tasks, but will immensely help you once you start making libraries out of the code you are writing now.


Commit#16
Time spent: 3 hours
1. Figuring out scanline polygon fill algorithm.

Commit#17
Time spent : 1 hour

1. Created an Edge2D class and populated all necessary atributes to the class object. 
Now, need to find the coordinates at which the the scanline intersects the edge.

Commit#18
Time spent: 1hour 30 mins

1. Still figuring out the scan line polygon fill algorithm.
2. Found out how to find intersection of 2 line segments and writing a function for that purpose. 


Commit#19
Time spent: 15 mins

1. Found out the intersection point of the scanline and an edge of the polygon. Now just need to find 
the intersection pairs and sort it and we are done.

Commit#20
1. Added the stackoverflow answer which provided me with the help in solving the algorithm as a pdf file 
so later on I can clearly see how I figured out the algorithm

Commit#21
Time spent: 60 mins


1. Figured out the scanline polygon fill algorithm. Works for a triangle. Now, need to find out whether it works
for a polygon with n vertices. If it doesnt , need to write code for that.

