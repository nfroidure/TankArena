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

var Point=new Class({
	Extends: Shape,
	initialize: function(x, y, z) {
		this.parent(x, y, z);
		},
	hit : function(shape) {
		if(shape instanceof Point)
			{
			return this.pointHitPoint(this,shape);
			}
		else if(shape instanceof Rectangle)
			{
			return this.pointHitRectangle(this,shape);
			}
		else if(shape instanceof Circle)
			{
			return this.pointHitCircle(this,shape);
			}
		else
			console.log('Unexpected collision !');
		},
	destruct : function() {
		}
});
