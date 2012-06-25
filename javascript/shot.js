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
		this.parent(game, x, y, z);
		this.a=a; // Angle %pi/8 [0-16]
		this.tank=tank;
		this.t=13;
		this.accel=1;
		this.maxSpeed=3;
		this.speed=1;
		this.range=80;
		this.shapes.push(new Point(this.x,this.y,this.z));
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
			this.shapes[0].x=this.x=this.x + (Math.cos(this.a*Math.PI/8)*this.speed);
			this.shapes[0].y=this.y=this.y + (Math.sin(this.a*Math.PI/8)*this.speed);
			this.range--;
			this.declarePositions();
			}
		else
			this.remove();
		},
	draw : function() {
		this.game.drawTile(this.t, this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z);
		this.parent();
		},
	rewind : function() {
		this.remove();
		},
	hit : function(sprite) {
		var hit=(sprite!=this.tank?this.parent(sprite):false);
		if(hit&&sprite.damage)
			{
			sprite.damage(20);
			}
		return hit;
		},
	destruct : function() {
		}
});
