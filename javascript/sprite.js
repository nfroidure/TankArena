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
	initialize: function(game, x, y, z) {
		this.game = game;
		this.tiles=new Array();
		this.x=x;
		this.y=y;
		this.z=z;
		this.index=-1;
		this.solidity=1;
		this.life=100;
		this.shapes=new Array();
		this.declarePositions();
		},
	declarePositions : function() {
		var newIndex=Math.floor(this.x/33)+'-'+Math.floor(this.y/33);
		if(newIndex!=this.index)
			{
			console.log('"'+this.index+' -> '+newIndex+'":'+this.x+','+this.y);
			if(this.index!=-1)
				this.game.grid[this.index].splice(this.game.grid[this.index].indexOf(this),1);
			if(!this.game.grid[newIndex])
				this.game.grid[newIndex]=new Array();
			this.game.grid[newIndex].push(this);
			this.index=newIndex;
			}
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
		index=this.game.controlableSprites.indexOf(this);
		if(this.index!=-1)
			this.game.grid[this.index].splice(this.game.grid[this.index].indexOf(this),1);
		},
	draw : function() {
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
		},
	destruct : function() {
		}
});