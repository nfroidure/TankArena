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

var Sprite=new Class({
	initialize: function(game, x, y, z, specs) {
		this.game = game;
		this.tiles=new Array();
		this.x=x;
		this.y=y;
		this.z=z;
		this.a=0;
		this.index=-1;
		this.life=100;
		this.hitField=3;
		// Specs
		if(!specs)
			specs={};
		this.solidity=(specs.solidity?specs.solidity:1);
		var shapes=(specs.shapes&&specs.shapes.length?specs.shapes:null)
		this.shapes=new Array();
		if(shapes&&shapes.length)
			{
			for(var i=shapes.length-1; i>=0; i--)
				{
				switch(shapes[i].type)
					{
					case 'Circle':
						this.shapes.push(new Circle(this.x,this.y,this.z, (shapes[i].r?shapes[i].r:12),
							(shapes[i].dx?shapes[i].dx:0), (shapes[i].dy?shapes[i].dy:0),
							(shapes[i].dz?shapes[i].dz:0), (shapes[i].cx?shapes[i].cx:0),
							(shapes[i].cy?shapes[i].cy:0)));
						break;
					case 'Rectangle':
						this.shapes.push(new Rectangle(this.x,this.y,this.z, (shapes[i].w?shapes[i].w:20),
							(shapes[i].h?shapes[i].h:20), (shapes[i].dx?shapes[i].dx:0),
							(shapes[i].dy?shapes[i].dy:0), (shapes[i].dz?shapes[i].dz:0),
							(shapes[i].cx?shapes[i].cx:0), (shapes[i].cy?shapes[i].cy:0)));
						break;
					case 'Point':
						this.shapes.push(new Point(this.x,this.y,this.z,
							(shapes[i].dx?shapes[i].dx:0), (shapes[i].dy?shapes[i].dy:0),
							(shapes[i].dz?shapes[i].dz:0), (shapes[i].cx?shapes[i].cx:0),
							(shapes[i].cy?shapes[i].cy:0)));
						break;
					}
				}
			}
		else
			this.shapes.push(new Rectangle(this.x,this.y,this.z,this.game.tileSize,this.game.tileSize));
		this.declarePositions();
		},
	declarePositions : function() {
		for(var i=this.shapes.length-1; i>=0; i--)
			{
			this.shapes[i].x=this.x-(this.shapes[i].cx?this.shapes[i].cx:0)+(this.shapes[i].dx?Math.cos(this.a*Math.PI/8)*this.shapes[i].dx:0)-(this.shapes[i].dy?Math.sin(this.a*Math.PI/8)*this.shapes[i].dy:0);
			this.shapes[i].y=this.y-(this.shapes[i].cy?this.shapes[i].cy:0)+(this.shapes[i].dy?Math.cos(this.a*Math.PI/8)*this.shapes[i].dy:0)+(this.shapes[i].dx?Math.sin(this.a*Math.PI/8)*this.shapes[i].dx:0);
			this.shapes[i].z=this.z+this.shapes[i].dz;
			}
		var newIndex=Math.floor(this.x/33)+'-'+Math.floor(this.y/33);
		if(newIndex!=this.index)
			{
			//console.log('"'+this.index+' -> '+newIndex+'":'+this.x+','+this.y+','+this.z+','+this.speed);
			if(this.index!=-1)
				this.game.grid[this.index].splice(this.game.grid[this.index].indexOf(this),1);
			if(!this.game.grid[newIndex])
				this.game.grid[newIndex]=new Array();
			this.game.grid[newIndex].push(this);
			this.index=newIndex;
			}
		},
	hits : function() {
		if(this.shapes.length)
			{
			var pos=this.index.split('-');
			var nearSprites=this.game.getNearSprites(this,parseInt(pos[0]),parseInt(pos[1]),this.hitField);
			for(var i=nearSprites.length-1; i>=0; i--)
				{
				if(nearSprites[i].shapes.length&&this.hit(nearSprites[i]))
					return nearSprites[i];
				}
			}
		return false;
		},
	hit : function(sprite) {
		for(var i=this.shapes.length-1; i>=0; i--)
			{
			for(var j=sprite.shapes.length-1; j>=0; j--)
				{
				if(this.shapes[i].hit(sprite.shapes[j]))
					return true;
				}
			}
		return false;
		},
	damage : function(power) {
		if(this.life>0)
			{
			this.life=this.life-Math.round(power/this.solidity);
			if(this.life<0)
				this.life=0;
			}
		},
	remove : function() {
		var index=this.game.sprites.indexOf(this);
		if(index>=0)
			this.game.sprites.splice(index,1);
		if(this.index!=-1)
			this.game.grid[this.index].splice(this.game.grid[this.index].indexOf(this),1);
		},
	draw : function() {
		this.game.contexts[this.game.numCanvas-1].fillStyle='#FFFFFF';
		this.game.contexts[this.game.numCanvas-1].strokeStyle='#FFFFFF';
		for(var i=this.shapes.length-1; i>=0; i--)
			{
			this.game.contexts[this.game.numCanvas-1].fillRect((this.shapes[i].x*this.game.zoom)-2+this.game.decalX,(this.shapes[i].y*this.game.zoom)-2+this.game.decalY,4,4);
			if(this.shapes[i] instanceof Circle)
				{
				this.game.contexts[this.game.numCanvas-1].beginPath();
				this.game.contexts[this.game.numCanvas-1].arc((this.shapes[i].x*this.game.zoom)+this.game.decalX,(this.shapes[i].y*this.game.zoom)+this.game.decalY,this.shapes[i].r*this.game.zoom,0,Math.PI*2,true);
				this.game.contexts[this.game.numCanvas-1].stroke();
				this.game.contexts[this.game.numCanvas-1].closePath();
				}
			else if(this.shapes[i] instanceof Rectangle)
				this.game.contexts[this.game.numCanvas-1].strokeRect((this.shapes[i].x*this.game.zoom)-2+this.game.decalX,(this.shapes[i].y*this.game.zoom)-2+this.game.decalY,(this.shapes[i].w*this.game.zoom)+4,(this.shapes[i].h*this.game.zoom)+4);
			}
		if(this.visionField)
			{
			this.game.contexts[this.game.numCanvas-1].fillStyle='#DDDDDD';
			this.game.contexts[this.game.numCanvas-1].strokeStyle='#DDDDDD';
			this.game.contexts[this.game.numCanvas-1].beginPath();
			this.game.contexts[this.game.numCanvas-1].arc((this.visionField.x*this.game.zoom)+this.game.decalX,(this.visionField.y*this.game.zoom)+this.game.decalY,this.visionField.r*this.game.zoom,0,Math.PI*2,true);
			this.game.contexts[this.game.numCanvas-1].stroke();
			this.game.contexts[this.game.numCanvas-1].closePath();
			}
		},
	destruct : function() {
		}
});