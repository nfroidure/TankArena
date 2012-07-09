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
	Extends: Sprite,
	initialize: function(game, tank, x, y, z, a) {
		this.parent(game, x, y, z,[{'type':'Point'}]);
		this.a=a; // Angle %pi/8 [0-16]
		this.tank=tank;
		this.t=13;
		this.accel=1;
		this.maxSpeed=5;
		this.speed=(this.a==this.tank.a&&this.tank.speed?this.tank.speed+1:1);
		this.range=80;
		},
	move : function() {
		if(this.range>0)
			{
			this.prevX=this.x;
			this.prevY=this.y;
			this.speed=this.speed+this.accel;
			if(this.speed>this.maxSpeed)
				this.speed=this.maxSpeed;
			else if(this.speed<-(this.maxSpeed/2))
				this.speed=-(this.maxSpeed/2);
			this.x=this.x + (Math.cos(this.a*Math.PI/8)*this.speed);
			this.y=this.y + (Math.sin(this.a*Math.PI/8)*this.speed);
			this.range--;
			this.declarePositions();
			return true;
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
			sprite.damage(20);
			this.game.playSound('explode');
			}
		return hit;
		},
	destruct : function() {
		}
});
