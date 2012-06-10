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

var Building=new Class({
	Extends: Rectangle,
	initialize: function(game, x, y, z, t) {
		this.parent(game, x, y, z);
		this.t=t;
		this.w=this.game.tileSize;
		this.h=this.game.tileSize;
		this.declarePositions();
		},
	draw : function() {
		this.game.drawTile(this.t, this.x, this.y);
		},
	destruct : function() {
		}
});
