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

var Rectangle=new Class({
	Extends: Shape,
	initialize: function( x, y, z, w, h) {
		this.parent(x, y, z);
		this.w=w;
		this.h=h;
		},
	hit : function(shape) {
		if(shape instanceof Rectangle)
			{
			return this.rectangleHitRectangle(shape,this);
			}
		else if(shape instanceof Circle)
			{
			return this.circleHitRectangle(shape,this);
			}
		else if(shape instanceof Point)
			{
			return this.pointHitRectangle(shape,this);
			}
		else
			console.log('Unexpected collision !');
		},
	inside : function(shape) {
		if(shape instanceof Rectangle)
			{
			return this.rectangleInsideRectangle(shape,this);
			}
		else if(shape instanceof Circle)
			{
			return this.circleInsideRectangle(shape,this);
			}
		else if(shape instanceof Point)
			{
			return this.pointHitRectangle(shape,this);
			}
		else
			console.log('Unexpected collision !');
		},
	destruct : function() {
		}
});
