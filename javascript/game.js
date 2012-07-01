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

var Game=new Class({
	initialize: function(element, rootPath,localizeFunction,noticeFunction)
		{
		this.element=element;
		this.rootPath=(rootPath?rootPath:'');
		if(localizeFunction)
			this.localize=localizeFunction;
		if(noticeFunction)
			this.notice=noticeFunction;
		// Creating canvas
		this.numCanvas=5;
		while(element.childNodes[0])
			element.removeChild(element.childNodes[0]);
		this.canvas=new Array();
		this.contexts=new Array();
		for(var i=0; i<this.numCanvas; i++)
			this.canvas.push(document.createElement('canvas'));
		this.wrapper=document.createElement('div');
		if(this.canvas[0].getContext)
			{
			for(var i=0; i<this.numCanvas; i++)
				{
				if(i>0)
					{
					element.appendChild(this.canvas[i]);
					this.canvas[i].setStyle('position','absolute');
					}
				else
					{
					element.appendChild(this.wrapper);
					this.wrapper.appendChild(this.canvas[i]);
					this.wrapper.setStyle('position','absolute');
					}
				this.contexts[i]=this.canvas[i].getContext('2d');
				}
			// Setting debug canvas styles
			this.initEvents();
			this.initTiles(this.reset.bind(this));
			this.initSounds();
			}
		else
			{
			element.appendChild(document.createTextNode('Go buy a real browser !'));
			}
		},
	reset : function() {
		this.zoom=2;
		this.fps=25;
		this.map={'w':100,'h':50,
			'floorSet':[0,1,2,3],
			'floors':[{'t':4,'x':1,'y':7},{'t':5,'x':1,'y':8},{'t':6,'x':2,'y':7},{'t':7,'x':2,'y':8},{'t':11,'x':8,'y':5},{'t':10,'x':9,'y':5},
				{'t':10,'x':9,'y':5},{'t':10,'x':10,'y':5},{'t':10,'x':11,'y':5},{'t':10,'x':12,'y':5},{'t':12,'x':13,'y':5}]};
		this.grid=new Array(this.map.h*this.map.w);
		this.fit();
		this.playSound('bg');
		this.controlableSprites=new Array();
		this.controlledSprite=0;
		this.sprites=new Array(new Tank(this,33,33,1,0,{'t':13,'maxSpeed':3,'turret':true}),
			new Tank(this,165,165,1,0,{'t':14,'maxSpeed':4,'turret':false,'fireZones':[{'r':12,'a':-Math.PI/3*2},{'r':12,'a':Math.PI/3*2}],'r':9}),
			new Tank(this,99,66,1,0,{'t':15,'maxSpeed':7,'turret':false,'fireZones':[{'r':8,'a':-Math.PI/2}],'r':8}),
			new Tank(this,165,132,1,0,{'t':16,'maxSpeed':7,'turret':true,'fireZones':[{'r':8,'a':-Math.PI/2},{'r':8,'a':Math.PI/2}],'r':12}),
			new Tank(this,165,66,1,0,{'t':17,'maxSpeed':7,'turret':true,'fireZones':[{'r':10,'a':0}],'solidity':4}),
			new Tank(this,330,66,1,0,{'t':18,'maxSpeed':7,'turret':false,'fireZones':[{'r':5,'a':0}],'solidity':1,'r':3}),
			new Tank(this,330,330,1,0,{'t':19,'maxSpeed':7,'turret':true,'fireZones':[{'r':10,'a':-Math.PI/3},{'r':10,'a':0},{'r':10,'a':Math.PI/3}],'solidity':3,'r':9}),
			new Tank(this,330,181,1,0,{'t':20,'maxSpeed':7,'turret':true,'fireZones':[{'r':12,'a':-Math.PI/3},{'r':12,'a':Math.PI/3}],'solidity':3}),
			new Tank(this,363,181,1,0,{'t':10,'maxSpeed':11,'turret':false,'fireZones':[{'r':12,'a':-Math.PI/3},{'r':12,'a':Math.PI/3}],'solidity':1,'fly':true}),
			new Tank(this,396,181,1,0,{'t':11,'maxSpeed':13,'turret':false,'fireZones':[{'r':12,'a':-Math.PI/3},{'r':12,'a':Math.PI/3}],'solidity':1,'fly':true}),
			new Tank(this,429,181,1,0,{'t':12,'maxSpeed':16,'turret':false,'fireZones':[{'r':12,'a':-Math.PI/3},{'r':12,'a':Math.PI/3}],'solidity':1,'fly':true}),
			new Tank(this,285,220,1,0,{'t':25,'maxSpeed':0,'turret':false,'fireZones':[{'r':14,'a':0}],'solidity':6}),
			//Man new Tank(this,363,330,1,0,{'t':26,'maxSpeed':7,'turret':true,'fireZones':[{'r':12,'a':-Math.PI/3},{'r':12,'a':Math.PI/3}],'solidity':6}),
			new Building(this,330,132,0,[8,14,15]),new Building(this,363,132,0,[8,14,15]),new Building(this,396,132,0,[8,14,15]));
		this.resume();
		},
	pause : function() {
		clearTimeout(this.timer);
		this.timer=0;
		},
	resume : function() {
		if(!this.timer)
			this.timer=this.main.delay(1000/this.fps, this);
		},
	resize : function() {
		this.fit();
		},
	fit : function() {
		var size=this.element.getSize();
		this.width=size.x;
		this.height=size.y;
		this.wrapper.setStyle('overflow','hidden');
		this.wrapper.setStyle('width',size.x+'px');
		this.wrapper.setStyle('height',size.y+'px');
		this.canvas[0].width=this.map.w*this.tileSize*this.zoom;
		this.canvas[0].height=this.map.h*this.tileSize*this.zoom;
		this.canvas[0].setStyle('position','relative');
		for(var i=this.numCanvas-1; i>0; i--)
			{
			this.canvas[i].width=this.width;
			this.canvas[i].height=this.height;
			this.canvas[i].setStyle('display','block');
			}
		this.contexts[0].fillStyle = '#000000';
		this.contexts[0].textBaseline='top';
		this.contexts[0].font='10px Helvetica bold, sans-serif';
		this.contexts[0].textAlign='left';
		for(var i=this.map.w-1; i>=0; i--)
			{
			for(var j=this.map.h-1; j>=0; j--)
				{
				var floor=this.map.floorSet[(i+j)%this.map.floorSet.length];
				this.drawTile(floor, i*this.tileSize, j*this.tileSize);
				this.contexts[0].fillText(i+'-'+j,( i*this.tileSize*this.zoom)+5, (j*this.tileSize*this.zoom)+5, 33*this.zoom);
				}
			}
		for(var i=this.map.floors.length-1; i>=0; i--)
			{
			this.drawTile(this.map.floors[i].t, this.map.floors[i].x*this.tileSize, this.map.floors[i].y*this.tileSize);
			}
		},
	main : function() {
		if(this.timer)
			{
			// Fixing game view
			this.decalX=-Math.round((this.controlableSprites[this.controlledSprite].x*this.zoom)-(this.width/2));
			this.decalX=(this.decalX>0?0:this.decalX);
			this.decalX=(this.decalX<-((this.map.w*this.tileSize*this.zoom)-this.width)?-((this.map.w*this.tileSize*this.zoom)-this.width):this.decalX);
			this.decalY=-Math.round((this.controlableSprites[this.controlledSprite].y*this.zoom)-(this.height/2));
			this.decalY=(this.decalY>0?0:this.decalY);
			this.decalY=(this.decalY<-((this.map.h*this.tileSize*this.zoom)-this.height)?-((this.map.h*this.tileSize*this.zoom)-this.height):this.decalY);
			//console.log('View:'+this.controlableSprites[this.controlledSprite].x+'-('+this.width+'/2)'+'='+x+','+this.controlableSprites[this.controlledSprite].y+'-('+this.height+'/2)'+'='+y);
			this.canvas[0].setStyle('left',this.decalX+'px');
			this.canvas[0].setStyle('top',this.decalY+'px');
			for(var i=this.numCanvas-1; i>0; i--)
				this.clearTiles(i);
			for(var i=this.sprites.length-1; i>=0; i--)
				{
				var curSprite=this.sprites[i];
				// Moving movable sprites
				if(curSprite&&curSprite.move)
					{
					curSprite.move();
					curSprite.hits();
					}
				// Drawing sprites
				if(curSprite)
					curSprite.draw();
				}
			this.timer=this.main.delay(1000/this.fps, this);
			}
		},
	/* Sprites management */
	getNearSprites : function(sprite,grixX,gridY,hitField) {
		var nearSprites=new Array();
		for(var k=(grixX>hitField?grixX-hitField:0),	l=(grixX<this.map.w-hitField?grixX+hitField:this.map.w); k<l; k++)
			{
			for(var m=(gridY>hitField?gridY-hitField:0), n=(gridY<this.map.h-hitField?gridY+hitField:this.map.h); m<n; m++)
				{
				if(this.grid[k+'-'+m]&&this.grid[k+'-'+m].length)
					{
					for(var j=this.grid[k+'-'+m].length-1; j>=0; j--)
						{
						if(sprite!=this.grid[k+'-'+m][j])
							{
							nearSprites.push(this.grid[k+'-'+m][j]);
							}
						}
					}
				}
			}
		return nearSprites;
		},
	/* Tiles management */
	initTiles : function(callback) {
		this.loadingTiles=0;
		this.tiles=new Array();
		this.tileSize=33;
		this.images=new Array();
		this.loadingTilesCallback=callback;
		this.registerTileImage(this.rootPath+'sprites/floors.png');
		this.registerTileImage(this.rootPath+'sprites/buildings.png');
		this.registerTileImage(this.rootPath+'sprites/icons.png');
		this.registerTileImage(this.rootPath+'sprites/animations.png');
		this.registerTileImage(this.rootPath+'sprites/boat1.png');
		this.registerTileImage(this.rootPath+'sprites/boat2.png');
		this.registerTileImage(this.rootPath+'sprites/car1.png');
		this.registerTileImage(this.rootPath+'sprites/car2.png');
		this.registerTileImage(this.rootPath+'sprites/copter1.png');
		this.registerTileImage(this.rootPath+'sprites/copter2.png');
		this.registerTileImage(this.rootPath+'sprites/plane1.png');
		this.registerTileImage(this.rootPath+'sprites/plane2.png');
		this.registerTileImage(this.rootPath+'sprites/plane3.png');
		this.registerTileImage(this.rootPath+'sprites/tank1.png');
		this.registerTileImage(this.rootPath+'sprites/tank2.png');
		this.registerTileImage(this.rootPath+'sprites/tank3.png');
		this.registerTileImage(this.rootPath+'sprites/tank4.png');
		this.registerTileImage(this.rootPath+'sprites/tank5.png');
		this.registerTileImage(this.rootPath+'sprites/tank6.png');
		this.registerTileImage(this.rootPath+'sprites/tank7.png');
		this.registerTileImage(this.rootPath+'sprites/tank8.png');
		this.registerTileImage(this.rootPath+'sprites/tank9.png');
		this.registerTileImage(this.rootPath+'sprites/tank10.png');
		this.registerTileImage(this.rootPath+'sprites/tank11.png');
		this.registerTileImage(this.rootPath+'sprites/tank12.png');
		this.registerTileImage(this.rootPath+'sprites/towers.png');
		this.registerTileImage(this.rootPath+'sprites/man.png');
		},
	registerTileImage : function(uri) {
		var n=this.images.length;
		this.images[n] = new Image();
		this.tiles=[{'i':0,'x':5,'y':0,'label':'Sand 1'},
				{'i':0,'x':5,'y':1,'label':'Sand 2'},
				{'i':0,'x':5,'y':2,'label':'Sand 3'},
				{'i':0,'x':6,'y':0,'label':'Sand 4'},
				{'i':0,'x':6,'y':7,'label':'Water TL 1'},
				{'i':0,'x':6,'y':8,'label':'Water BL 1'},
				{'i':0,'x':7,'y':7,'label':'Water TR 1'},
				{'i':0,'x':7,'y':8,'label':'Water BR 1'},
				{'i':1,'x':0,'y':11,'label':'Hangar GV 1'},
				{'i':2,'x':0,'y':0,'label':'Tank 1'},
				{'i':0,'x':3,'y':36,'label':'Road 1'},
				{'i':0,'x':1,'y':36,'label':'Road 2'},
				{'i':0,'x':4,'y':36,'label':'Road 3'},
				{'i':3,'x':0,'y':6,'label':'Shot'},
				{'i':1,'x':1,'y':11,'label':'Hangar GV 2'},
				{'i':1,'x':2,'y':11,'label':'Hangar GV 3'}];
		this.images[n].src = uri;
		this.loadingTiles++;
		this.images[n].onload = this.tileImageLoaded.bind(this);
		},
	tileImageLoaded : function() {
		this.loadingTiles--;
		if(this.loadingTiles==0)
			{
			this.loadingTilesCallback();
			this.loadingTilesCallback=null;
			}
		},
	drawTile : function(n, x, y, z) {
		this.drawImage(this.tiles[n].i, this.tiles[n].x, this.tiles[n].y, x, y, z, this.tiles[n].w, this.tiles[n].h);
		},
	drawImage : function(i, srcX, srcY, x, y, z, w, h) {
		z=Math.round(z);
		var zf=((!z)||z==1?1:z/2);
		this.contexts[(z?z:0)].drawImage(this.images[i], this.tileSize*srcX, this.tileSize*srcY,
			this.tileSize*(w?w:1), this.tileSize*(h?h:1), (this.zoom*x)-(this.zoom*((zf-1)*this.tileSize)/2)+(z>0?this.decalX:0), (this.zoom*y)-(this.zoom*((zf-1)*this.tileSize)/2)+(z>0?this.decalY:0), zf*this.zoom*this.tileSize*(w?w:1), zf*this.zoom*this.tileSize*(h?h:1));
		},
	clearTiles : function(z) {
		this.contexts[(z?z:0)].clearRect(0,0,this.canvas[(z?z:0)].width,this.canvas[(z?z:0)].height);
		},
	/* Sound management */
	initSounds : function() {
		this.muted=false;
		this.sounds=new Array();
		this.registerSound('bg',this.rootPath+'sounds/tune.ogg',true);
		this.registerSound('crash',this.rootPath+'sounds/crash.wav');
		this.registerSound('main',this.rootPath+'sounds/main.wav');
		this.registerSound('empty',this.rootPath+'sounds/empty.wav');
		this.registerSound('explode',this.rootPath+'sounds/expl.wav');
		},
	registerSound : function(sound, uri, loop) {
		this.sounds[sound] = new Audio(uri);
		this.sounds[sound].setAttribute('preload','preload');
		if(loop)
			this.sounds[sound].setAttribute('loop','loop');
		},
	playSound : function(sound) {
		if(!this.muted)
			{
			this.sounds[sound].pause();
			if(!this.sounds[sound].getAttribute('loop'))
				this.sounds[sound].currentTime=0;
			this.sounds[sound].play();
			//this.sounds[sound].cloneNode().play(); Download the sound each time!!! But could be a way to get multi-channel sound.
			}
		},
	stopSound : function(sound) {
		this.sounds[sound].pause();
		},
	mute : function() {
		this.muted=!this.muted;
		for(sound in this.sounds)
			{
			if(this.sounds[sound] instanceof Audio&&this.sounds[sound].getAttribute('loop'))
				this.sounds[sound].muted=this.muted;
			}
		},
	/* Events management */
	initEvents : function() {
		this.element.addEvent('mousemove',this.moveHandler.bind(this));
		this.element.addEvent('click',this.clickHandler.bind(this),true);
		this.element.addEvent('contextmenu',this.clickHandler.bind(this),true);
		window.addEvent('keydown',this.keyDownHandler.bind(this),true);
		window.addEvent('keyup',this.keyUpHandler.bind(this),true);
		},
	removeEvents : function() {
		this.element.removeEvents('mousemove');
		this.element.removeEvents('click');
		this.element.removeEvents('contextmenu');
		window.removeEvents('keydown');
		window.removeEvents('keyup');
		},
	moveHandler : function(e) {
		},
	clickHandler : function(e) {
		},
	keyDownHandler : function(e) {
		var used=true;
		if(e.code==77)
			{
			this.mute();
			}
		if(e.control)
			{
			if(e.code==107)
				{
				this.zoom++;
				this.fit();
				e.stop();
				}
			else if(e.code==109)
				{
				this.zoom--;
				this.zoom=(this.zoom<1?1:this.zoom);
				this.fit();
				e.stop();
				}
			}
		else
			{
			if(e.code==107)
				this.fps++;
			else if(e.code==109)
				{ this.fps--; this.fps=(this.fps<0?0:this.fps); }
			}
		switch(e.key)
			{
			case 'down':
				this.controlableSprites[this.controlledSprite].setWay(-1);
				break;
			case 'up':
				this.controlableSprites[this.controlledSprite].setWay(1);
				break;
			case 'left':
				this.controlableSprites[this.controlledSprite].setDirection(-1,e.control);
				break;
			case 'right':
				this.controlableSprites[this.controlledSprite].setDirection(1,e.control);
				break;
			case 'tab':
				break;
			default:
				used=false;
				break;
			}
		if(used)
			e.stop();
		},
	keyUpHandler : function(e) {
		var used=true;
		switch(e.key)
			{
			case 'down':
			case 'up':
				this.controlableSprites[this.controlledSprite].setWay(0);
				break;
			case 'left':
			case 'right':
				this.controlableSprites[this.controlledSprite].setDirection(0);
				break;
			case 'space':
				this.controlableSprites[this.controlledSprite].fire(e.control);
				break;
			case 'tab':
				this.controlledSprite=(this.controlledSprite+1)%this.controlableSprites.length;
				this.controlableSprites[this.controlledSprite].setDirection(0);
				this.controlableSprites[this.controlledSprite].setWay(0);
				break;
			default:
				used=false;
				break;
			}
		if(used)
			e.stop();
		},
	/* UI */
	notice : function(message) {
			alert(message);
		},
	localize : function() {
		return arguments[1].replace('$',arguments[2]);
		},
	/* End */
	close : function() {
		this.pause();
		this.removeEvents();
		},
	destruct : function() {
		}
});
