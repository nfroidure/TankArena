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

var Movable=new Class({
	Extends: Sprite,
	initialize: function(game, x, y, z, a) {
		this.parent(game, x, y, z);
		this.direction=0;
		this.a=a;
		this.way=0;
		this.speed=0;
		this.maxSpeed=0;
		},
	move : function() {
		this.prevX=this.x;
		this.prevY=this.y;
		if(this.direction!=0)
			this.a=(16+this.a+this.direction)%16;
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
	rewind : function() {
		this.x=this.prevX;
		this.y=this.prevY;
		},
	setDirection : function(direction) {
		if(direction==0||this.life<1)
			this.direction=0;
		else
			this.direction=direction;
		},
	setWay : function(way) {
		if(way==0||this.life<1)
			this.way=0;
		else
			this.way=way;
		},
	hit : function(sprite) {
		var hit=(sprite instanceof Shot?false:this.parent(sprite));
		if(hit&&this.speed)
			{
			this.speed=-(this.speed);
			this.way=-this.way;
			this.way=0;
			if(!(sprite instanceof  Shot))
				this.game.playSound('crash');
			}
		return hit;
		},
	destruct : function() {
		}
});
