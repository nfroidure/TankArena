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

var Building=new Class({
	Extends: Rectangle,
	initialize: function(game, x, y, z, t) {
		this.parent(game, x, y, z);
		this.t=t;
		this.w=this.game.tileSize;
		this.h=this.game.tileSize;
		this.solidity=1;
		this.life=100;
		this.declarePositions();
		},
	draw : function() {
		this.game.drawTile(this.game.map.floorSet[0], this.x, this.y, this.z);
		this.game.drawTile(this.t[2-Math.ceil(this.life/100*2)], this.x, this.y, this.z);
		},
	damage : function(power) {
		if(this.life>0)
			{
			this.life=this.life-Math.ceil(power/this.solidity);
			console.log('Building damaged:'+this.life);
			}
		if(this.life<1)
			{
			this.life=0;
			this.draw();
			this.remove();
			console.log('Building removed:'+this.life);
			}
		},
	destruct : function() {
		}
});
