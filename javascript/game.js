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
		while(element.childNodes[0])
			element.removeChild(element.childNodes[0]);
		this.canvas=new Array();
		this.contexts=new Array();
		for(var i=0; i<2; i++)
			this.canvas.push(document.createElement('canvas'));
		this.wrapper=document.createElement('div');
		if(this.canvas[0].getContext)
			{
			for(var i=0; i<2; i++)
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
			//this.reset();
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
		this.map={'w':300,'h':150,
			'floorSet':[0,1,2,3],
			'floors':[{'t':4,'x':1,'y':7},{'t':5,'x':1,'y':8},{'t':6,'x':2,'y':7},{'t':7,'x':2,'y':8}]};
		this.grid=new Array(this.map.h*this.map.w);
		this.fit();
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
		//this.playSound('bg');
		this.sprites=new Array(new Tank(this,33,33,0),new Tank(this,165,165,0),new Building(this,330,132,0,8));
		this.controlableSprites=new Array(this.sprites[0],this.sprites[1]);
		this.controlledSprite=0;
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
		this.canvas[0].width=this.map.w*this.tileSize;
		this.canvas[0].height=this.map.h*this.tileSize;
		for(var i=1; i>0; i--)
			{
			this.canvas[i].width=this.width;
			this.canvas[i].height=this.height;
			this.canvas[i].setStyle('display','block');
			}
		},
	main : function() {
		if(this.timer)
			{
			this.clearTiles(1);
			for(var i=this.sprites.length-1; i>=0; i--)
				{
				if(this.sprites[i].move)
					this.sprites[i].move();
				var pos=this.sprites[i].index.split('-');
				for(var k=(pos[0]>3?parseInt(pos[0])-3:0), l=(pos[0]<this.map.w-3?parseInt(pos[0])+3:this.map.w); k<l; k++)
					{
					for(var m=(pos[1]>3?parseInt(pos[1])-3:0), n=(pos[1]<this.map.h-3?parseInt(pos[1])+3:this.map.h); m<n; m++)
						{
						if(this.grid[k+'-'+m]&&this.grid[k+'-'+m].length)
							{
							for(var j=this.grid[k+'-'+m].length-1; j>=0; j--)
								{
								if(this.sprites[i]!=this.grid[k+'-'+m][j]&&this.sprites[i].hit)
									{
									if(this.sprites[i].hit(this.grid[k+'-'+m][j]))
										{
										console.log('hit');
										}
									else
										{
										//console.log(pos[0]+':'+pos[1]+'-'+k+':'+l+'-'+m+':'+n);
										//console.log('nohit');
										}
									}
								}
							}
						}
					}
				this.sprites[i].draw();
				}
			this.timer=this.main.delay(1000/this.fps, this);
			}
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
		this.registerTileImage(this.rootPath+'sprites/tank1.png');
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
				{'i':1,'x':0,'y':0,'label':'Tunnel GV 1'},
				{'i':2,'x':0,'y':0,'label':'Tank 1'}];
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
		this.contexts[(z?z:0)].drawImage(this.images[i], this.tileSize*srcX, this.tileSize*srcY,
			this.tileSize*(w?w:1), this.tileSize*(h?h:1), this.zoom*x, this.zoom*y, this.zoom*this.tileSize*(w?w:1), this.zoom*this.tileSize*(h?h:1));
		},
	clearTiles : function(z) {
		this.contexts[(z?z:0)].clearRect(0,0,this.canvas[(z?z:0)].width,this.canvas[(z?z:0)].height);
		},
	/* Sound management */
	initSounds : function() {
		this.muted=false;
		this.sounds=new Array();
		this.registerSound('bg',this.rootPath+'sounds/tune.ogg',true);
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
			this.sounds[sound].currentTime=0;
			this.sounds[sound].play();
			//this.sounds[sound].cloneNode().play(); Download the sound each time!!! But could be a way to get multi-channel sound.
			}
		},
	stopSound : function(sound) {
		this.sounds[sound].pause();
		},
	mute : function() {
		this.muted=true;
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
			case 'tab':
				this.controlledSprite=(this.controlledSprite+1)%this.controlableSprites.length;
				break;
			case 'space':
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