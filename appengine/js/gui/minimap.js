function Minimap(R) {
 	this.x = 10;
 	this.y = 25;
	this.width = 100;
	this.height = 100;
	this.relief = 4;
	var plane_width = R.DEFAULT_PLANE_WIDTH;
	var plane_height = R.DEFAULT_PLANE_HEIGHT;
	this.window_width = window.screen.availWidth;
	this.window_height = window.screen.availHeight;

	this.R = R;
	this.R_overlay = induce_overlay('minimap', this.x, this.y, this.x+this.width+1, this.y+this.height+1);

	this.minimap = this.R_overlay.rect(this.x, this.y, this.width, this.height).attr({
		fill: 'black', 
		stroke: 'black', 
		'stroke-width': 1, 
		'fill-opacity': 0.15
	});
	this.minimap.parent = this;

	this.viewport = this.R_overlay.rect(this.x, this.y, ((this.window_width/plane_width)*this.width), (this.window_height/plane_height)*this.height);
	this.viewport.parent = this;

	this.viewport.attr({
		'stroke-width': 1,
		fill: 'white', 
		stroke: 'black',
		'fill-opacity': 0.15
	});

	this.viewport.ox = this.x;
	this.viewport.oy = this.y;

	var zoom_x = 0;
	var zoom_y = 0;
	var zoom_width = this.window_width;
	var zoom_height = this.window_height;

	R.setViewBox(zoom_x, zoom_y, zoom_width, zoom_height, true);

	this.viewport.drag(this.move, this.start, this.end);
};

Minimap.prototype.start = function () {
	this.attr({
		opacity: 0.5
	});
	this.ox = this.attr("x");
	this.oy = this.attr("y");
};

Minimap.prototype.move = function (dx, dy) {
	this.parent.collisionMove(dx, dy);
};

Minimap.prototype.end = function () {
    this.attr({
    	opacity: 100
    });
};

Minimap.prototype.collisionMove = function (dx, dy) {
	var v_bbox = this.viewport.getBBox();
	var m_bbox = this.minimap.getBBox();
	var ox = this.viewport.ox;
	var oy = this.viewport.oy;
	var new_x = ox + dx;
	var new_y = oy + dy;
	var v_width = this.viewport.attr("width");
	var v_height = this.viewport.attr("height");
	var m_width = this.minimap.attr("width");
	var m_height = this.minimap.attr("height");

	//If viewport is colliding with left-bound
	//of minimap.
	if (new_x <= m_bbox.x)
		new_x = m_bbox.x;

	//If viewport is colliding with the right-
	//bound of minimap
	if (new_x + v_width >= m_bbox.x2)
		new_x =  m_bbox.x2 - v_width;
	
	//If viewport is colliding with the upper-
	//bound of the minimap
	if (new_y <= m_bbox.y) 
		new_y = m_bbox.y;

	//If viewport is colliding with the lower-
	//bound of the minimap
	if (new_y + v_height >= m_bbox.y2)
		new_y = m_bbox.y2 - v_height;
		
	this.viewport.attr({
		x: new_x,
		y: new_y
	});

	var v_ox = new_x;
	var v_oy = new_y;
	var m_ox = this.x;
	var m_oy = this.y;

	var zoom_x = ((v_ox-m_ox)/m_width)*this.R.DEFAULT_PLANE_WIDTH;
	var zoom_y = ((v_oy-m_oy)/m_height)*this.R.DEFAULT_PLANE_HEIGHT;
	var zoom_width = this.window_width;
	var zoom_height = this.window_height;

	this.R.setViewBox(zoom_x, zoom_y, zoom_width, zoom_height, true);
}

Minimap.prototype.addPoint = function (x, y) {
	var m_width = this.minimap.attr('width');
	var m_height = this.minimap.attr('height');
	var x_offset = this.minimap.attr('x');
	var y_offset = this.minimap.attr('y');
	var plane_height = this.R.DEFAULT_PLANE_HEIGHT;
	var plane_width = this.R.DEFAULT_PLANE_WIDTH;

	var zoom_x = ((x/plane_width)*m_width)+x_offset;
	var zoom_y = ((y/plane_height)*m_height)+y_offset;

	this.points_array.push(this.R_overlay.rect(zoom_x, zoom_y, 1, 1, this.R.DEFAULT_CURVATURE).attr({stroke: 'red'}));
}