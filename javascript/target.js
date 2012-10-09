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

var Target=new Class({
	Extends: Sprite,
	initialize: function(game, x, y, z, specs)
		{
		this.parent(game, x, y, z, specs);
		this.solidity=0;
		this.shapes.push(new Circle(this.game.tileSize));
		this.declarePositions();
		},
	draw : function()
		{
		this.parent();
		},
	hit : function(sprite)
		{
		this.shapes[0].z=sprite.z;
		if(this.parent(sprite))
			{
			if(sprite.targets&&sprite.targets[0]==this)
				{
				sprite.removeTarget(this);
				this.remove();
				if(!sprite.targets.length)
					this.game.playSound('beep');
				}
			//return true;
			}
		return false;
		},
	destruct : function()
		{
		}
});
