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

var Chain=new Class({
	Extends: Movable,
	initialize: function(game, x, y, z, a, specs)
		{
		specs.shapes=[{'type':'Point'}];
		this.parent(game, x, y, z, a,specs);
		this.tank=specs.tank;
		this.t=13;
		this.maxSpeed=10;
		this.speed=this.tank.speed+3;
		this.acceleration=3;
		this.direction=1;
		this.range=50;
		this.solidity=0;
		},
	move : function()
		{
		if(this.range>0)
			{
			this.range--;
			return this.parent();
			}
		else
			this.remove();
		return false;
		},
	draw : function()
		{
		this.parent();
		},
	hits : function()
		{
		if(this.parent())
			this.remove();
		},
	hit : function(sprite)
		{
		var hit=(sprite!=this.tank?this.parent(sprite):false);
		if(hit&&sprite.damage)
			{
			sprite.damage(20);
			this.game.playSound('ricoc'+Math.floor((Math.random()*6)+1));
			}
		return hit;
		},
	destruct : function()
		{
		}
});
