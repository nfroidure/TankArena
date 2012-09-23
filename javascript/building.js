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
	Extends: Sprite,
	initialize: function(game, x, y, z, specs) {
		specs.solidity=(specs.solidity?specs.solidity:3);
		this.parent(game, x, y, z, specs);
		this.t=(specs.t?specs.t:0);
		this.w=this.game.tileSize;
		this.h=this.game.tileSize;
		this.declarePositions();
		this.shapes.push(new Rectangle(this.x,this.y,this.z,this.w,this.h));
		},
	draw : function() {
		this.game.drawTile(this.game.map.floorSet[0], this.x, this.y, this.z);
		this.game.drawTile(this.t[2-Math.ceil(this.life/100*2)], this.x, this.y, this.z);
		this.parent();
		},
	damage : function(power) {
		this.parent(power);
		if(this.life==0)
			{
			this.draw();
			this.remove();
			}
		},
	destruct : function() {
		}
});
