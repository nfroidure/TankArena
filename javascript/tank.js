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

var Tank=new Class({
	Extends: Circle,
	initialize: function(game, x, y, a) {
		this.parent(game, x, y, 1, 12);
		this.direction=0;
		this.a=a; // Angle %pi/8 [0-16]
		this.turretDirection=0;
		this.ta=a;
		this.way=0;
		this.speed=0;
		this.maxSpeed=6;
		},
	move : function() {
		if(this.direction!=0)
			this.a=(16+this.a+this.direction)%16;
		if(this.turretDirection!=0)
			this.ta=(16+this.ta+this.turretDirection)%16;
		if(this.way!=0)
			{
			this.speed=this.speed+this.way;
			if(this.speed>this.maxSpeed)
				this.speed=this.maxSpeed;
			else if(this.speed<-(this.maxSpeed/2))
				this.speed=-(this.maxSpeed/2);
			}
		else if(this.speed>0)
			this.speed--;
		else if(this.speed<0)
			this.speed++;
		this.x=this.x + (Math.cos(this.a*Math.PI/8)*this.speed);
		this.y=this.y + (Math.sin(this.a*Math.PI/8)*this.speed);
		this.declarePositions();
		},
	draw : function() {
		this.game.drawImage(2, (this.a+4)%8, Math.floor(((this.a+4)%16)/8)+(this.way?2:0), this.x-this.r, this.y-this.r, this.z, 1, 1);
		this.game.drawImage(2, (this.ta+4)%8, Math.floor(((this.ta+4)%16)/8)+5, this.x-this.r, this.y-this.r, this.z, 1, 1);
		},
	setDirection : function(direction,turret) {
		if(direction==0)
			this.direction=this.turretDirection=direction;
		else if(turret)
			this.turretDirection=direction;
		else
			this.direction=direction;
		},
	setWay : function(way) {
		this.way=way;
		},
	hit : function(sprite) {
		var hit=this.parent(sprite);
		if(hit&&this.speed)
			{
			this.speed=-(this.speed);
			this.way=-this.way;
			if(sprite instanceof Circle)
				{
				var d=(this.r+sprite.r)-Math.ceil(Math.sqrt(((this.x-sprite.x)*(this.x-sprite.x))+((this.y-sprite.y)*(this.y-sprite.y))));
				this.x=this.x + (Math.cos(this.a*Math.PI/8)*d*this.way);
				this.y=this.y + (Math.sin(this.a*Math.PI/8)*d*this.way);
				}
			this.way=0;
			}
		return hit;
		},
	destruct : function() {
		}
});
