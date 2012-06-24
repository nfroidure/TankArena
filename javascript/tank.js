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
	initialize: function(game, x, y, z, a) {
		this.parent(game, x, y, 1, 12);
		this.direction=0;
		this.a=a; // Angle %pi/8 [0-16]
		this.z=(z?z:1);
		this.turretDirection=0;
		this.ta=a;
		this.way=0;
		this.speed=0;
		this.maxSpeed=6;
		},
	move : function() {
		this.prevX=this.x;
		this.prevY=this.y;
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
	rewind : function() {
		this.x=this.prevX;
		this.y=this.prevY;
		},
	draw : function() {/*
		this.game.drawImage(2, (this.a+4)%8, Math.floor(((this.a+4)%16)/8)+(this.way?2:0), this.x-this.r, this.y-this.r, this.z, 1, 1);
		this.game.drawImage(2, (this.ta+4)%8, Math.floor(((this.ta+4)%16)/8)+5, this.x-this.r, this.y-this.r, this.z, 1, 1);*/
		this.game.drawImage(2, (this.a+4)%8, Math.floor(((this.a+4)%16)/8)+(this.way?2:0), this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z, 1, 1);
		this.game.drawImage(2, (this.ta+4)%8, Math.floor(((this.ta+4)%16)/8)+5, this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z, 1, 1);
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
	fire : function() {
		this.game.sprites.push(new Shot(this.game,this,this.x,this.y,this.z,this.ta));
		},
	hit : function(sprite) {
		var hit=(sprite instanceof Shot?false:this.parent(sprite));
		if(hit&&this.speed)
			{
			this.speed=-(this.speed);
			this.way=-this.way;
			this.way=0;
			}
		return hit;
		},
	destruct : function() {
		}
});
