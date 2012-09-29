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

var Shot=new Class({
	Extends: Movable,
	initialize: function(game, x, y, z, a, specs) {
		specs.shapes=[{'type':'Point'}];
		this.parent(game, x, y, z, a,specs);
		this.tank=specs.tank;
		this.t=13;
		this.maxSpeed=5;
		this.speed=this.tank.speed+3;
		this.acceleration=3;
		this.direction=1;
		this.range=80;
		},
	move : function() {
		if(this.range>0)
			{
			this.range--;
			return this.parent();
			}
		else
			this.remove();
		return false;
		},
	draw : function() {
		this.game.drawTile(this.t, this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z);
		this.parent();
		},
	hits : function() {
		if(this.parent())
			this.remove();
		},
	hit : function(sprite) {
		var hit=(sprite!=this.tank?this.parent(sprite):false);
		if(hit&&sprite.damage)
			{
			sprite.damage(100);
			this.game.playSound('explode');
			}
		return hit;
		},
	destruct : function() {
		}
});
