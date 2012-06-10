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
	Extends: Sprite,
	initialize: function(game, x, y, z, r) {
		this.parent(game, x, y, z);
		this.r=r;
		},
	hit : function(sprite) {
		if(sprite instanceof Rectangle)
			{
			return this.circleHitRectangle(this,sprite);
			}
		else if(sprite instanceof Circle)
			{
			return this.circleHitCircle(sprite,this);
			}
		else if(sprite instanceof Point)
			{
			return this.pointHitCircle(sprite,this);
			}
		else
			console.log('Unexpected collision !');
		},
	destruct : function() {
		}
});
