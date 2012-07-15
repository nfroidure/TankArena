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
	Extends: Controlable,
	initialize: function(game, x, y, z, shapes, a) {
		this.parent(game, x, y, z, shapes);
		this.direction=0;
		this.a=a;
		this.way=0;
		this.speed=0;
		this.maxSpeed=0;
		this.acceleration=1;
		this.inerty=1;
		this.targets=new Array();
		},
	// Move management
	move : function() {
		var moved=false;
		this.prevX=this.x;
		this.prevY=this.y;
		this.prevA=this.a;
		// Computing targets
		this.target();
		// Rotating
		if(this.direction!=0)
			{
			this.a=(16+this.a+this.direction)%16;
			moved=true;
			}
		// Accelerating
		if(this.maxSpeed&&this.way!=0)
			{
			this.speed=this.speed+(this.way*this.acceleration);
			if(this.speed>this.maxSpeed)
				this.speed=this.maxSpeed;
			else if(this.speed<-(this.maxSpeed/2))
				this.speed=-(this.maxSpeed/2);
			}
		else if(this.speed>0)
			this.speed=this.speed-this.inerty;
		else if(this.speed<0)
			this.speed=this.speed+this.inerty;
		if(Math.abs(this.speed)<this.inerty)
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
	// Targets management
	setTargets : function() {
		this.targets=arguments;
		},
	addTarget : function(target) {
		this.target.push(target);
		},
	target : function() {
		if(this.targets.length)
			{
			// Finding the angle
			var a=0;
			a=Math.round((((2*Math.PI)+Math.atan2(this.targets[this.targets.length-1].y-this.y, this.targets[this.targets.length-1].x-this.x))%(2*Math.PI))/(2*Math.PI)*16);
			// Adjusting the direction to atteign it
			if(a-this.a<0)
				this.direction=-1;
			else if(a-this.a>0)
				this.direction=1;
			else
				this.direction=0;
			return a;
			}
		return 0;
		},
	// Hits management
	hits : function() {
		var spriteHitted=this.parent();
		if(spriteHitted)
			{
			this.speed=-(this.speed);
			this.way=0;
			this.x=this.prevX;
			this.y=this.prevY;
			this.a=this.prevA;
			this.declarePositions();
			if(!(spriteHitted instanceof Shot))
				this.game.playSound('crash');
			}
		return spriteHitted;
		},
	hit : function(sprite) {
		return (sprite instanceof Shot?false:this.parent(sprite));
		},
	destruct : function() {
		}
});
