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
	Extends: Movable,
	initialize: function(game, x, y, z, a, specs) {
		this.parent(game, x, y, z, a);
		this.turretDirection=0;
		this.ta=a;
		this.curFireZone=0;
		this.animStep=0;
		// Tank specs
		if(!specs)
			specs={};
		this.t=(specs.t?specs.t:2);
		this.hasTurret=(specs.turret?true:false);
		this.maxSpeed=(specs.maxSpeed?specs.maxSpeed:3);
		this.solidity=(specs.solidity?specs.solidity:2);
		this.fireZones=(specs.fireZones?specs.fireZones:[{'r':10,'a':0}]);
		this.shapes.push(new Circle(this.x,this.y,this.z, (specs.r?specs.r:12)));
		},
	move : function() {
		this.parent();
		if(!this.hasTurret)
			this.ta=this.a;
		else if(this.turretDirection!=0)
			this.ta=(16+this.ta+this.turretDirection)%16;
		this.shapes[0].x=this.x;
		this.shapes[0].y=this.y;
		this.animStep=(this.animStep+1)%5;
		},
	draw : function() {
		if(this.life>0)
			{
			//this.game.drawImage(this.t, (this.a+4)%8, Math.floor(((this.a+4)%16)/8)+(this.way?2:0), this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z, 1, 1);
			this.game.drawImage(this.t, (this.a+4)%8, Math.floor(((this.a+4)%16)/8)+((!this.speed)||this.animStep>2?2:0), this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z, 1, 1);
			if(this.hasTurret)
				this.game.drawImage(this.t, (this.ta+4)%8, Math.floor(((this.ta+4)%16)/8)+5, this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z, 1, 1);
			}
		else
			{
			this.game.drawImage(this.t, 7, 4, this.x-this.game.tileSize/2, this.y-this.game.tileSize/2, this.z, 1, 1);
			}
		this.parent();
		},
	setDirection : function(direction,turret) {
		if(direction==0||this.life<1)
			this.direction=this.turretDirection=0;
		else if(turret)
			this.turretDirection=direction;
		else
			this.parent(direction);
		},
	damage : function(power) {
		if(this.life==0)
			this.remove();
		else
			{
			this.parent(power);
			if(this.life==0)
				this.draw();
			}
		},
	fire : function(secondary) {
		if(this.life>0)
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
				this.game.sprites.push(new Shot(this.game,this,this.x+x,this.y+y,this.z,this.ta));
				this.game.playSound('main');
				this.game.drawImage(3, 4, 2, this.x-this.game.tileSize/2+x, this.y-this.game.tileSize/2+y, this.z, 1, 1);
				}
			}
		},
	destruct : function() {
		}
});
