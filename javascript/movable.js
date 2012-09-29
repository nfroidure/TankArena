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
	initialize: function(game, x, y, z, a, specs) {
		this.parent(game, x, y, z, specs);
		this.rotation=0;
		this.a=a;
		this.way=0;
		this.speed=(specs.speed?specs.speed:0);
		this.inerty=(specs.inerty?specs.inerty:10);
		this.acceleration=(specs.acceleration?specs.acceleration:30);
		this.maxSpeed=(specs.maxSpeed||specs.maxSpeed===0?specs.maxSpeed:3);
		},
	// Move management
	move : function() {
		var moved=false;
		this.prevX=this.x;
		this.prevY=this.y;
		this.prevA=this.a;
		// Rotating
		if(this.rotation!=0)
			{
			this.a=(16+this.a+this.rotation)%16;
			moved=true;
			}
		// Accelerating
		if(this.maxSpeed&&this.way!=0)
			{
			this.speed=this.speed+(this.way*this.acceleration*this.maxSpeed/100);
			if(this.speed>this.maxSpeed)
				this.speed=this.maxSpeed;
			else if(this.speed<-(this.maxSpeed/2))
				this.speed=-(this.maxSpeed/2);
			}
		else if(this.speed!=0)
			{
			this.speed=this.speed+((this.speed>0?-1:1)*this.inerty*this.maxSpeed/100);
			}
		if(Math.abs(this.speed)<this.inerty*this.maxSpeed/100)
			this.speed=0;
		// Moving
		if(this.speed)
			{
			this.x=this.x + (Math.cos(this.a*Math.PI/8)*this.speed);
			this.y=this.y + (Math.sin(this.a*Math.PI/8)*this.speed);
			if(this.x>this.game.map.w*this.game.tileSize)
				this.x-=this.game.map.w*this.game.tileSize;
			if(this.y>this.game.map.h*this.game.tileSize)
				this.y-=this.game.map.h*this.game.tileSize;
			if(this.x<0)
				this.x+=this.game.map.w*this.game.tileSize;
			if(this.y<0)
				this.y+=this.game.map.h*this.game.tileSize;
			moved=true;
			}
		if(moved)
			this.declarePositions();
		return moved;
		},
	setRotation : function(rotation) {
		if(rotation==0||this.life<1)
			this.rotation=0;
		else
			this.rotation=rotation;
		},
	setWay : function(way) {
		if(way==0||this.life<1)
			this.way=0;
		else
			this.way=way;
		},
	// Hits management
	hits : function() {
		var spriteHitted=this.parent();
		if(spriteHitted)
			{
			this.way=0;
			if(!(spriteHitted instanceof Shot))
				{
				this.speed=-(this.speed);
				this.x=this.prevX;
				this.y=this.prevY;
				this.a=this.prevA;
				this.game.playSound('crash');
				}
			this.declarePositions();
			}
		return spriteHitted;
		},
	hit : function(sprite) {
		return (sprite instanceof Shot?false:this.parent(sprite));
		},
	destruct : function() {
		}
});
