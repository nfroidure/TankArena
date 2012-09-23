/*
 * Copyright (C) 2012 Jonathan Kowalski
 * Copyright (C) 2012 Nicolas Froidure
 *
 * This file is free software;
 * you can redistribute it and/or modify it under the terms of the GNU
 * General Public License (GPL) as published by the Free Software
 * Foundation, in version 2. It is distributed in the
 * hope that it will be useful, but WITHOUT ANY WARRANTY of any kind.
 *
 */

var Controlable=new Class({
	Extends: Movable,
	initialize: function(game, x, y, z, a, specs) {
		this.parent(game, x, y, z, a, specs);
		this.game.controlableSprites.push(this);
		this.owner=0; // LocalHuman / NetworkHuman / Computer
		},
	remove : function() {
		this.parent();
		var index=this.game.controlableSprites.indexOf(this);
		if(index>=0)
			{
			this.game.controlableSprites.splice(index,1);
			if(index==this.game.controlledSprite)
				this.game.changeControlledSprite(true);
			}
		},
	move : function() {
		// Computing targets
		if(this.life)
			this.target();
		else
			{
			this.way=0;
			this.direction=0;
			}
		this.parent();
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
	destruct : function() {
		}
});
