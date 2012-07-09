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

var Circle=new Class({
	Extends: Shape,
	initialize: function(x, y, z, r, dx, dy, dz, cx, cy) {
		this.parent(x, y, z, dx, dy, dz, cx, cy);
		this.r=r;
		},
	hit : function(shape) {
		if(!this.parent(shape))
			return false;
		if(shape instanceof Rectangle)
			{
			return this.circleHitRectangle(this,shape);
			}
		else if(shape instanceof Circle)
			{
			return this.circleHitCircle(shape,this);
			}
		else if(shape instanceof Point)
			{
			return this.pointHitCircle(shape,this);
			}
		else
			console.log('Unexpected collision !');
		},
	inside : function(shape) {
		if(shape instanceof Rectangle)
			{
			return this.rectangleInsideCircle(this,shape);
			}
		else if(shape instanceof Circle)
			{
			return this.circleInsideCircle(shape,this);
			}
		else if(shape instanceof Point)
			{
			return this.pointHitCircle(shape,this);
			}
		else
			console.log('Unexpected collision !');
		},
	destruct : function() {
		}
});
