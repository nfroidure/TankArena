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
	Extends: Controlable,
	initialize: function(game, x, y, z, a, specs) {
		this.parent(game, x, y, z, a, specs);
		this.turretRotation=0;
		this.ta=a;
		this.curFireZone=0;
		this.animStep=0;
		this.t=(specs.t?specs.t:2);
		this.hasTurret=(specs.turret?true:false);
		this.hasWings=(specs.fly?true:false);
		if(this.inerty>2&&specs.fly)
			this.inerty=2;
		if(this.acceleration>4&&specs.fly)
			this.acceleration=4;
		this.detectionField=(specs.detectionField?specs.detectionField:6);
		this.fireZones=(specs.fireZones?specs.fireZones:[{'r':10,'a':0}]);
		this.waitLoad=0;
		},
	move : function() {
		var moved=this.parent();
		if(this.hasWings)
			{
			if(this.speed<=0)
				this.z=1;
			else
				this.z=this.speed/this.maxSpeed*this.game.numCanvas-1;
			this.shapes[0].z=this.z=(this.z<1?1:(this.z>this.game.numCanvas-1?this.game.numCanvas-1:this.z));
			}
		if(!this.hasTurret)
			this.ta=this.a;
		else if(this.turretRotation!=0)
			this.ta=(16+this.ta+this.turretRotation)%16;
		this.animStep=(this.animStep+1)%5;
		if(this.waitLoad)
			this.waitLoad--;
		return moved;
		},
	draw : function() {
		if(this.life>0)
			{
			//this.game.drawImage(this.t, (this.a+4)%8, Math.floor(((this.a+4)%16)/8)+(this.direction?2:0), this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z, 1, 1);
			this.game.drawImage(this.t, (this.a+4)%8, Math.floor(((this.a+4)%16)/8)+((!this.speed)||this.animStep>2?0:2), this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z, 1, 1);
			if(this.hasTurret)
				this.game.drawImage(this.t, (this.ta+4)%8, Math.floor(((this.ta+4)%16)/8)+5, this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z, 1, 1);
			}
		else
			{
			this.game.drawImage(this.t, 7, 4, this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z, 1, 1);
			}
		this.parent();
		},
	setRotation : function(rotation,turret) {
		if(rotation==0||this.life<1)
			this.rotation=this.turretRotation=0;
		else if(turret)
			this.turretRotation=rotation;
		else
			this.parent(rotation);
		},
	damage : function(power) {
		if(this.life==0)
			this.remove();
		else
			{
			this.parent(power);
			}
		},
	fire : function(secondary) {
		if(this.life>0&&!this.waitLoad)
			{
			var ta=(this.fireZones[this.curFireZone].a?this.fireZones[this.curFireZone].a:0)+this.ta;
			var x=(Math.cos(ta*Math.PI/8)*this.fireZones[this.curFireZone].r);
			var y=(Math.sin(ta*Math.PI/8)*this.fireZones[this.curFireZone].r);
			this.curFireZone=(this.curFireZone+1)%this.fireZones.length;
			if(secondary)
				{
				this.game.playSound('empty');
				}
			else
				{
				this.game.sprites.push(new Shot(this.game,this.x+x,this.y+y,this.z,this.ta,{'tank':this}));
				this.game.playSound('main');
				this.game.drawImage(3, 4, 2, this.x-this.game.tileSize/2+x, this.y-this.game.tileSize/2+y, this.z, 1, 1);
				if(!this.hasWings)
					{
					if(this.a==this.ta)
						this.speed=-this.maxSpeed;
					else if(this.a==(this.ta+Math.PI)%(2*Math.PI))
						this.speed=this.maxSpeed;
					}
				this.waitLoad=30;
				}
			}
		},
	target : function() {
		if(this.game.controlableSprites[this.game.controlledSprite]!=this&&this.life&&!(this.targets[0] instanceof Target))
			{
			var nearSprites, pos, nearestSprite, nearestSpriteDistance,  currentSpriteDistance, a=-1;
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
			// Attacking him
			if(nearestSprite&&Math.sqrt(nearestSpriteDistance.distance)<this.detectionField*this.game.tileSize)
				{
				this.setTargets(nearestSprite);
				a=this.parent(4*this.game.tileSize);
				if(this.hasTurret)
					{
					if(a-this.ta<0)
						this.turretRotation=-1;
					else if(a-this.ta>0)
						this.turretRotation=1;
					else
						this.turretRotation=0;
					}
				if(this.waitLoad==0&&this.rotation==0&&this.turretRotation==0)
					{
					// Should not fire if the anmo is more limited
					this.fire();
					}
				}
			return a;
			}
		return this.parent();
		}, 
	destruct : function() {
		}
});
