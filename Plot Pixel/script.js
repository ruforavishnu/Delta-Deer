
console.log('testing if script loaded');
// const canvas = document.querySelector('.myCanvas');
// const ctx = canvas.getContext('2d');

// function plotPixel(x,y, imageData)
// {
// 	ctx.putImageData(imageData, x,y);	
// }

// var id = ctx.createImageData(1,1);
// var d = id.data;
// let [r,g,b,a] = [255,0,0,0.0];
// d[0] = r;
// d[1] = g;
// d[2] = b;
// d[3] = a;


// plotPixel(100,100, id);


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvasHeight = canvas.height;
ctx.clearRect(0, 0, canvasWidth, canvasHeight);
var id = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
var pixels = id.data;

var x = Math.floor(Math.random() * canvasWidth);
var y = Math.floor(Math.random() * canvasHeight);
var r = Math.floor(Math.random() * 256);
var g = Math.floor(Math.random() * 256);
var b = Math.floor(Math.random() * 256);
var off = (y * id.width + x) * 4;
pixels[off] = r;
pixels[off + 1] = g;
pixels[off + 2] = b;
pixels[off + 3] = 255;

ctx.putImageData(id, 0, 0);