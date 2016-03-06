var Vector = function(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.dobutok = function(b) {
		return this.x * b.x + this.y * b.y + this.z * b.z;
	}
	this.plus = function(b) {
		return new Vector(b.x + this.x, b.y + this.y, b.z + this.z);
	}
	this.minus = function(b) {
		return new Vector(this.x - b.x, this.y - b.y, this.z - b.z);
	}
	this.reverse = function() {
		return new Vector(-this.x, -this.y, -this.z);
	}
	this.multiply = function(alpha) {
		return new Vector(this.x*alpha, this.y*alpha, this.z * alpha);
	}
	this.length = function() {
		return Math.sqrt((this.x) * (this.x)
			            + (this.y) * (this.y)
			            + (this.z) * (this.z));
	}
	this.dist = function(B) {
		return B.minus(this).length();
	}
}
//-----------------------------------------------------------------
var Point = function(coord, normal, color) {
	this.coord = coord;
	this.normal = normal;
	this.color = color;
	this.width = 4;
	this.draw = function(lights) {
		var oldStyle = ctx.fillStyle;

		var color = GetCOlorwithLight(lights, this)

		ctx.fillStyle = generateColor(color);
		var z = get2dCoords(this.coord);
		ctx.fillRect(z.x-this.width/2, z.y-this.width/2,this.width,this.width);
		ctx.fillStyle = oldStyle;
	}
	this.clear = function() {
		var oldStyle = ctx.fillStyle;
		ctx.fillStyle = "#fff";
		var z = get2dCoords(this.coord);
		ctx.fillRect(z.x-this.width, z.y-this.width,this.width*2,this.width*2);
		ctx.fillStyle = oldStyle;
	}
}
//-----------------------------------------------------------------
//-----Constants---------------------------------------------------
var RED = new Vector(255,0,0);
var GREEN = new Vector(0,255, 0);
var BLUE = new Vector(0,0,255);
var GRAY = new Vector(1,1,1);
var WHITE = GRAY.multiply(255);
var BLACK = GRAY.plus(new Vector(-1,-1,-1));
var center = new Vector(200, 100,0);
var mashtab = new Vector(75,75,75);
//------FUNCTIONS--------------------------------------------------
var get2dCoords = function(coord) {
	var x = coord.x*mashtab.x;
	var y = coord.y*mashtab.y;
	var z = coord.z*mashtab.z;
	var resx = center.x + (y - x) * Math.sqrt(3) /2;
	var resy = center.y + (x + y) / 2 - z;
	return new Vector(resx, resy, 0);
}

var generateColor = function(color) {
	return "rgb(" + Math.round(color.x) + ", " 
	              + Math.round(color.y) + ", " 
	              + Math.round(color.z) + ")";
}

var drawLine = function(p1, p2, color, size) {
	var z1 = get2dCoords(p1.coord);
	var z2 = get2dCoords(p2.coord);
	ctx.strokeStyle = generateColor(color);
	ctx.beginPath();
	ctx.moveTo(z1.x,z1.y);
	ctx.lineTo(z2.x,z2.y);
	if (size) 
		ctx.lineWidth = size;
	else
		ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
}

var getPointsBetween = function(A, B, N) {
	var res = [];
	res.push(A);
	var dr = B.coord.minus(A.coord).multiply( 1 / (N+1));

	for (var i = 0; i < N; i++)
	{
		var newPoint = new Point(dr.multiply(i+1).plus(A.coord), A.normal, BLACK);
		res.push(newPoint);
	}
	res.push(B);
	return res;
}

var getPoligonPoints = function(A, B, C, D, N) {
	var mas = getPointsBetween(A, B, N);
	var mas2 = getPointsBetween(D, C, N);
	var res = [];
	for (var i = 0; i < mas.length; i++) {
		res = res.concat(getPointsBetween(mas[i], mas2[i], N));
	}
	return res;
}
var setColor = function(points, color) {
	for (var i = 0; i < points.length; i++){
		points[i].color = color;
	}
}
var setNormal = function(points, normal) {
	for (var i = 0; i < points.length; i++){
		points[i].normal = normal;
	}
}
var GetCOlorwithLight = function(lights, point) {
	var oldColor = point.color;
	add = 0;

	if (lights)
	{
		for (var i = 0; i < lights.length; i++) {
			var r = lights[i].normal;
			var n = point.normal;
			if (r.length() == 0) {
				//r = new Vector(-1,0,0);
			}

		
				
			var d = lights[i].coord.dist(point.coord);
			var intensity = r.dobutok(n);
			var dr = lights[i].coord.minus(point.coord);
			if (dr.dobutok(n) > 0)
			{
				intensity /= -n.length();
				intensity /= d;
				add += intensity;
			}

		}
	}
	oldColor = oldColor.plus(GRAY.multiply(add));


	return oldColor;
}

//-----------------------------------------------------------------


var canvas = document.getElementById("canvas");
canvas.width = 400;
canvas.height = 300;

var ctx = canvas.getContext("2d");

var Ad = new Point(new Vector(0,0,0), new Vector(0,0,1), BLACK);
var Bd = new Point(new Vector(2,0,0), new Vector(0,0,1), BLACK);
var Cd = new Point(new Vector(2,2,0), new Vector(0,0,1), BLACK);
var Dd = new Point(new Vector(0,2,0), new Vector(0,0,1), BLACK);

var Au = new Point(new Vector(0,0,1), new Vector(0,0,1), BLACK);
var Bu = new Point(new Vector(2,0,1), new Vector(0,0,1), BLACK);
var Cu = new Point(new Vector(2,2,1), new Vector(0,0,1), BLACK);
var Du = new Point(new Vector(0,2,1), new Vector(0,0,1), BLACK);

var lights = [];
lights.push(new Point(new Vector(1, 1, 0), new Vector(-100,0,0), RED));

var z1 = getPoligonPoints(Bd, Bu, Cu, Cd, 50);
setNormal(z1, new Vector(1,0,0));





var t =0;
var f = function() {
	lights[0].clear();
	lights[0].coord = new Vector(2.5,0.5, Math.sin(t)*2);

	for (var i = 0; i < z1.length; i++) {
		//z[i].clear();
		z1[i].draw(lights);
	}

	if (lights[0].coord.z < 0)
		lights[0].color = BLUE;
	else 
		lights[0].color = RED;

	lights[0].draw();
	t += 0.1;
	

	setTimeout(f, 16);
};
f();


/* 
drawLine(Ad, Bd, BLACK);
drawLine(Bd, Cd, BLACK);
drawLine(Cd, Dd, BLACK);
drawLine(Dd, Ad, BLACK);

drawLine(Au, Bu, BLACK);
drawLine(Bu, Cu, BLACK);
drawLine(Cu, Du, BLACK);
drawLine(Du, Au, BLACK);

drawLine(Au, Ad, BLACK);
drawLine(Bu, Bd, BLACK);
drawLine(Cu, Cd, BLACK);
drawLine(Du, Dd, BLACK);
*/