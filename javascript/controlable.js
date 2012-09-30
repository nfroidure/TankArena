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

var Controlable=new Class({
	Extends: Movable,
	initialize: function(game, x, y, z, a, specs) {
		this.parent(game, x, y, z, a, specs);
		this.game.controlableSprites.push(this);
		this.owner=0; // LocalHuman / NetworkHuman / Computer
		this.targets=new Array();
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
			this.direction=0;
			this.rotation=0;
			}
		return this.parent();
		},
	// Targets management
	setTargets : function() {
		for(var i=this.targets.length-1; i>=0; i--)
			{
			if(this.targets[i] instanceof Target)
				this.targets[i].remove();
			}
		this.targets=new Array();
		for(var i=0, j=arguments.length; i<j; i++)
			this.targets.push(arguments[i]);
		},
	addTarget : function(target) {
		this.targets.push(target);
		},
	removeTarget : function(target) {
		var index=this.targets.indexOf(target);
		if(index>=0)
			{
			this.targets.splice(index,1);
			if(target instanceof Target)
				target.remove();
			}
		if(!this.target.length)
			{
			this.rotation=0;
			this.turretRotation=0;
			if(!this.hasWings) // planes never stops, too long to implement
				this.direction=0;
			}
		},
	target : function(distanceMin) {
		if(this.game.controlableSprites[this.game.controlledSprite]!=this&&((!this.targets.length)||!(this.targets[0] instanceof Target)))
			{
			this.locateTarget();
			}
		if(this.targets.length)
			{
			var vd=this.getVirtualDistance(this.targets[0]),
				a=Math.round((((2*Math.PI)+Math.atan2(vd.y-this.y, vd.x-this.x))%(2*Math.PI))/(2*Math.PI)*16)%16;
			// Adjusting the rotation to atteign it
			if((16+this.a-a)%16==0)
				this.rotation=0;
			else if((16+this.a-a)%16>8)
				this.rotation=1;
			else
				this.rotation=-1;
			// Going to the target
			this.direction=1;
			// Consider fighting
			if(this.hasTurret)
				{
				if((16+this.a-a)%16==0)
					this.turretRotation=0;
				else if((16+this.a-a)%16>8)
					this.turretRotation=1;
				else
					this.turretRotation=-1;
				}
			if((!(this.targets[0] instanceof Target))&&this.waitLoad==0&&this.rotation==0&&this.turretRotation==0)
				{
				// Should not fire if the anmo is more limited
				this.fire();
				}
			return a;
			}
		else if(this.game.controlableSprites[this.game.controlledSprite]!=this&&!this.hasWings)
			this.direction=0;
		return -1;
		},
	locateTarget : function() {
		var nearSprites, pos, nearestSprite=null, nearestSpriteDistance,  currentSpriteDistance;
		// Getting near sprites
		pos=this.index.split('-');
		nearSprites=this.game.getNearSprites(this,parseInt(pos[0]),parseInt(pos[1]),(this.hasWings&&this.z?this.z:1)*this.detectionField);
		// Trying to locate the nearest
		for(var i=nearSprites.length-1; i>=0; i--)
			{
			if(nearSprites[i].team&&nearSprites[i].team!=this.team)
				{
				currentSpriteDistance=this.getVirtualDistance(nearSprites[i]);
				if((!nearestSprite)||nearestSpriteDistance.distance>currentSpriteDistance)
					{
					nearestSpriteDistance=currentSpriteDistance;
					nearestSprite=nearSprites[i];
					}
				}
			}
		if(nearestSprite&&Math.sqrt(nearestSpriteDistance.distance)<this.detectionField*this.game.tileSize)
			{
			this.setTargets(nearestSprite);
			}
		},
	destruct : function() {
		}
});
