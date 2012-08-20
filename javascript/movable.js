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
		this.direction=0;
		this.a=a;
		this.way=0;
		this.speed=(specs.speed?specs.speed:0);
		this.inerty=(specs.inerty?specs.inerty:10);
		this.acceleration=(specs.acceleration?specs.acceleration:30);
		this.maxSpeed=(specs.maxSpeed||specs.maxSpeed===0?specs.maxSpeed:3);
		this.targets=new Array();
		},
	// Move management
	move : function() {
		var moved=false;
		this.prevX=this.x;
		this.prevY=this.y;
		this.prevA=this.a;
		// Computing targets
		if(this.life)
			this.target();
		else
			{
			this.way=0;
			this.direction=0;
			}
		// Rotating
		if(this.direction!=0)
			{
			this.a=(16+this.a+this.direction)%16;
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
		this.targets=new Array();
		for(var i=0, j=arguments.length; i<j; i++)
			this.targets.push(arguments[i]);
		},
	addTarget : function(target) {
		this.targets.push(target);
		},
	target : function(distanceMin) {
		if(this.targets.length)
			{
			var a=Math.round((((2*Math.PI)+Math.atan2(this.targets[0].y-this.y, this.targets[0].x-this.x))%(2*Math.PI))/(2*Math.PI)*16)%16;
			// Adjusting the direction to atteign it (needs improvement)
			if(a-this.a<0)
				this.direction=-1;
			else if(a-this.a>0)
				this.direction=1;
			else
				this.direction=0;
			// Measuring the distance to the target
			if(Math.sqrt(Math.pow(this.x-this.targets[0].x,2) + Math.pow(this.y-this.targets[0].y,2))<(distanceMin?distanceMin:this.game.tileSize))
				{
				if(this.direction==0)
					this.targets.splice(0,1);
				this.way=0;
				}
			// Finding the angle
			else
				{
				this.way=1;
				}
			return a;
			}
		return -1;
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
