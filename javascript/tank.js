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
	Extends: Sprite,
	initialize: function(game, x, y, z, a) {
		this.parent(game, x, y, z);
		this.direction=0;
		this.a=a; // Angle %pi/8 [0-16]
		this.turretDirection=0;
		this.ta=a;
		this.way=0;
		this.speed=0;
		this.maxSpeed=6;
		this.solidity=2;
		this.life=100;
		this.fireZones=[{'r':10,'a':0}];
		this.curFireZone=0;
		this.shapes.push(new Circle(this.x,this.y,this.z, 12));
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
		this.shapes[0].x=this.x=this.x + (Math.cos(this.a*Math.PI/8)*this.speed);
		this.shapes[0].y=this.y=this.y + (Math.sin(this.a*Math.PI/8)*this.speed);
		this.declarePositions();
		},
	rewind : function() {
		this.x=this.prevX;
		this.y=this.prevY;
		},
	draw : function() {
		if(this.life>0)
			{
			this.game.drawImage(2, (this.a+4)%8, Math.floor(((this.a+4)%16)/8)+(this.way?2:0), this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z, 1, 1);
			this.game.drawImage(2, (this.ta+4)%8, Math.floor(((this.ta+4)%16)/8)+5, this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z, 1, 1);
			}
		else
			{
			this.game.drawImage(2, 7, 4, this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z, 1, 1);
			}
		this.parent();
		},
	setDirection : function(direction,turret) {
		if(direction==0||this.life<1)
			this.direction=this.turretDirection=0;
		else if(turret)
			this.turretDirection=direction;
		else
			this.direction=direction;
		},
	setWay : function(way) {
		if(way==0||this.life<1)
			this.way=0;
		else
		this.way=way;
		},
	damage : function(power) {
		if(this.life>0)
			{
			this.life=this.life-Math.ceil(power/this.solidity);
			console.log('Tank damaged:'+this.life);
			}
		else
			{
			this.remove();
			console.log('Tank removed:'+this.life);
			}
		},
	fire : function(secondary) {
		if(this.life>0)
			{
			var x=(Math.cos(this.ta*Math.PI/8)*this.fireZones[this.curFireZone].r);
			var y=(Math.sin(this.ta*Math.PI/8)*this.fireZones[this.curFireZone].r);
			this.curFireZone=(this.curFireZone+1)%this.fireZones.length;
			if(secondary)
				{
				this.game.playSound('empty');
				}
			else
				{
				this.game.sprites.push(new Shot(this.game,this,this.x+x,this.y+y,this.z,this.ta));
				this.game.playSound('main');
				this.game.drawImage(3, 4, 2, this.x-this.game.tileSize/2+x, this.y-this.game.tileSize/2+y, this.z, 1, 1);
				}
			}
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
