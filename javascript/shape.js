/*
 * Copyright (C) 2012 Nicolas Froidure
 *
 * This file is free software;
 * you can redistribute it and/or modify it under the terms of the GNU
 * General Public License (GPL) as published by the Free Software
 * Foundation, in version 2. It is distributed in the
 * hope that it will be useful, but WITHOUT ANY WARRANTY of any kind.
 *
 */

var Shape=new Class({
	initialize: function(dx, dy, dz, cx, cy) {
		this.x=0;
		this.y=0;
		this.z=0;
		this.dx=(dx?dx:0);
		this.dy=(dy?dy:0);
		this.dz=(dz?dz:0);
		this.cx=(cx?cx:0);
		this.cy=(cy?cy:0);
		},
	pointHitPoint : function(point1,point2) {
		return (point1.x == point2.x && point1.y == point2.y);
		},
	pointHitRectangle : function(point,rect) {
		return (point.x >= rect.x 
			&& point.x < rect.x + rect.w
			&& point.y >= rect.y 
			&& point.y < rect.y + rect.h);
		},
	pointHitCircle : function(point,circ) {
		var d2 = (point.x-circ.x)*(point.x-circ.x) + (point.y-circ.y)*(point.y-circ.y);
		return(d2<=circ.r*circ.r);
		},
	rectangleHitRectangle : function(rect1,rect2) {
			return !((rect1.x >= rect2.x + rect2.w)
				|| (rect1.x + rect1.w <= rect2.x)
				|| (rect1.y >= rect2.y + rect2.h)
				|| (rect1.y + rect1.h <= rect2.y));
		},
	circleHitRectangle : function(circ,rect) {
		if(this.rectangleHitRectangle({'x':circ.x-circ.r,'y':circ.y-circ.r,'w':circ.r*2,'h':circ.r*2},rect))
			{
			if(this.pointHitCircle({'x':rect.x,'y':rect.y},circ)
				||this.pointHitCircle({'x':rect.x+rect.w,'y':rect.y},circ)
				||this.pointHitCircle({'x':rect.x+rect.w,'y':rect.y+rect.h},circ)
				||this.pointHitCircle({'x':rect.x,'y':rect.y+rect.h},circ))
				return true;
			if(this.pointHitRectangle(circ,rect))
				return true;
			if(this.circProj(circ,rect.x,rect.y,rect.x,rect.y+rect.h)
				||this.circProj(circ,rect.x,rect.y,rect.x+rect.w,rect.y))
				return true;
			}
		return false;
		},
	circleHitCircle : function(circ1,circ2) {
		var d2 = (circ1.x-circ2.x)*(circ1.x-circ2.x) + (circ1.y-circ2.y)*(circ1.y-circ2.y);
		return !(d2 > (circ1.r + circ2.r)*(circ1.r + circ2.r));
		},
	circProj : function(circ,Ax,Ay,Bx,By) {
		var ACx = circ.x-Ax;
		var ACy = circ.y-Ay; 
		var ABx = Bx-Ax;
		var ABy = By-Ay; 
		var BCx = circ.x-Bx;
		var BCy = circ.y-By; 
		var s1 = (ACx*ABx) + (ACy*ABy);
		var s2 = (BCx*ABx) + (BCy*ABy); 
		if (s1*s2>0)
			return false;
		return true;
		},
	circleInsideCircle : function(circ1,circ2) {
		return (circ1.x-circ1.r>circ2.x-circ2.r
						&&circ1.x+circ1.r<circ2.x+circ2.r
						&&circ1.y-circ1.r>circ2.y-circ2.r
						&&circ1.y+circ1.r<circ2.y+circ2.r);
		},
	circleInsideRectangle : function(circ,rect) {
		return (circ.x-circ.r>rect.x
						&&circ.x+circ.r<rect.x+rect.w
						&&circ.y-circ.r>rect.y
						&&circ.y+circ.r<rect.y+rect.h);
		},
	rectangleInsideCircle : function(rect,circ) {
		return (rect.x>circ.x-circ.r
						&&rect.x+rect.w<circ.x+circ.r
						&&rect.y>circ.y-circ.r
						&&rect.y+rect.h<circ.y+circ.r);
		},
	hit : function(shape) {
		if(Math.abs(this.z-shape.z)<2)
			return true;
		},
	destruct : function() {
		}
});
