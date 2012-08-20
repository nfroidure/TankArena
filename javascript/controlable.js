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
	destruct : function() {
		}
});
