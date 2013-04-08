////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
//Visual Methods
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////


/*
Level.renderShape
~attr: Raphael attributes for rendering

Remove old rapheal shape and
replace with new shape with
input attributes and setup
handlers
*/
Level.prototype.renderShape = function(attr) {
	//for plane
	if(!this.parent) {
		this.shape = this.paper.rect(0,0,this.DEFAULT_PLANE_WIDTH,this.DEFAULT_PLANE_HEIGHT).attr(attr);
		/*this.shape.mouseover(function () {
			this.animate({"fill-opacity": .2}, 500); });
		this.shape.mouseout(function () {
			this.animate({"fill-opacity": .1}, 500); });*/
	}
	//for cut
	else {
		this.shape = this.paper.rect(0,0,this.DEFAULT_CHILD_WIDTH,this.DEFAULT_CHILD_HEIGHT,this.DEFAULT_CURVATURE).attr(attr);
		//mouseover effects
		this.shape.mouseover(function () {
			this.attr({"fill-opacity": 0.2}); });
		this.shape.mouseout(function () {
			this.attr({"fill-opacity": 0.0}); });

		this.shape.drag(this.onDragMove,this.onDragStart,this.onDragEnd);
	}

	//shape has parent pointer back to level
	//allows for referencing in Raphael callbacks
	this.shape.parent = this;
	this.shape.click(function(e) {ContextMenu.SingleClickHandler(this.parent,e);});
	this.shape.dblclick(this.onDoubleClick);
};


/*
Level.updateLevel

Update color of level and shift shape to front.
Used when invalidating level's level
*/
Level.prototype.updateLevel = function() {
	this.shape.toFront();
	//color spectrum based on level
	var color = 0; Raphael.getColor.reset();
	for(var x =1; x<=this.getLevel()+1;x++){
		color = Raphael.getColor();
	}
	this.shape.attr(
		{fill: color,
		stroke: color});
	this.leaves.iterate(function(node) {
		node.updateLevel();
	});
	this.subtrees.iterate(function(node) {
		node.updateLevel();
	});
};


/*
Level.expand(float cx, float cy, float cw, float ch)
~cx: child x
~cy: child y
~cw: child width
~ch: child height

Assumes child just added/moved inside level;
Assumes state prior to change is valid;
Expands level appropriatly to fit child;
Then expands its parent;
*/
Level.prototype.expand = function(cx,cy,cw,ch,animate) {
	//doesn't expand main plane
	if(this.parent) {
		var sc = 20; //slack
		//initial state
		var x = this.shape.attrs.x; var y = this.shape.attrs.y;
		var w = this.shape.attrs.width; var h = this.shape.attrs.height;
		//expanded x,y
		var new_x = x; var new_y = y;
		if(x > cx-sc) { //child is out of bounds on left
			new_x = cx-sc;
			w += x-new_x; //match width to expansion
		}
		if(y > cy-sc) { //child is out of bounds on top
			new_y = cy-sc;
			h += y-new_y; //match height to expansion
		}
		//expanded width,height
		//child is out of bounds on right
		var new_width = (new_x+w < cx+cw+sc) ? cx+cw+sc-new_x: w;
		//child is out of bounds on bottom
		var new_height = (new_y+h < cy+ch+sc) ? cy+ch+sc-new_y: h;

		//update shape
		var expanded_att = {
			x: new_x,
			y: new_y,
			width: new_width,
			height: new_height};
		if(animate)
			this.shape.animate(expanded_att,200,"<");
		this.shape.attr(expanded_att);

		//expand parent
		this.parent.expand(new_x,new_y,new_width,new_height,animate);

		//move collided nodes out of way
		this.parent.shiftAdjacent(this,this.shape.getBBox());
	}
};


/*
Level.contract

Takes level's shape and
contracts its around all
children and variables like a hull;
*/
Level.prototype.contract = function(animate) {
	//D(this);
	if(this.parent) {
		var sc = 20; //slack
		//state variables
		var new_x = this.shape.attrs.x+(this.shape.attrs.width)/4;
		var new_y = this.shape.attrs.y+(this.shape.attrs.height)/4;
		var new_width = this.DEFAULT_CHILD_WIDTH, new_height = this.DEFAULT_CHILD_HEIGHT;
		var initial_hull_set_flag = false; //flag for hull initilization

		if(this.subtrees.length) { //if children
			//intial hull around first child with slack
			var itr = this.subtrees.begin();
			var cx = itr.val.shape.attrs.x; var cy = itr.val.shape.attrs.y;
			var cw = itr.val.shape.attrs.width; var ch = itr.val.shape.attrs.height;
			//contracted properties
			new_x = cx-sc; var new_y = cy-sc;
			new_width = cw+sc+sc;
			new_height = ch+sc+sc;
			initial_hull_set_flag = true;
			itr = itr.next; //move to next child
			while(itr!=this.subtrees.end()) {
				//fit hull
				var cx = itr.val.shape.attrs.x, cy = itr.val.shape.attrs.y;
				var cw = itr.val.shape.attrs.width, ch = itr.val.shape.attrs.height;
				if(cx-sc <= new_x) {
					new_width += new_x-(cx-sc);
					new_x = cx-sc;
				}
				if(cy-sc <= new_y) {
					new_height += new_y-(cy-sc);
					new_y = cy-sc;
				}
				new_width = (cx+cw+sc<=new_x+new_width) ? new_width : cx+cw+sc-new_x;
				new_height = (cy+ch+sc<=new_y+new_height) ? new_height : cy+ch+sc-new_y;
				itr = itr.next;
			}
		}

		if(this.leaves.length) { //if variables
			var itr = this.leaves.begin();
			if(!initial_hull_set_flag) { //if hull not initialized
				//intial hull around first variable with slack
				var cx = itr.val.text.getBBox().x, cy = itr.val.text.getBBox().y;
				var cw = itr.val.text.getBBox().width, ch = itr.val.text.getBBox().height;
				//contracted properties
				new_x = cx-sc, new_y = cy-sc;
				new_width = cw+sc+sc;
				new_height = ch+sc+sc;
				itr = itr.next; //move to next variable
			}
			while(itr!=this.leaves.end()) {
				//fit hull
				var cx = itr.val.text.getBBox().x, cy = itr.val.text.getBBox().y;
				var cw = itr.val.text.getBBox().width, ch = itr.val.text.getBBox().height;
				if(cx-sc <= new_x) {
					new_width += new_x-(cx-sc);
					new_x = cx-sc;
				}
				if(cy-sc <= new_y) {
					new_height += new_y-(cy-sc);
					new_y = cy-sc;
				}
				new_width = (cx+cw+sc<=new_x+new_width) ? new_width : cx+cw+sc-new_x;
				new_height = (cy+ch+sc<=new_y+new_height) ? new_height : cy+ch+sc-new_y;
				itr = itr.next;
			}
		}

		//update shape if children exist else revert to base state
		var expanded_att = {
			x: new_x,
			y: new_y,
			width: new_width,
			height: new_height
		};
		if(animate)
			this.shape.animate(expanded_att,200,"<");
		this.shape.attr(expanded_att);

		//contract parent
		this.parent.contract(animate);
	}
}


Level.prototype.drag = function(dx,dy) {
	if (this.parent){
		this.dragStart();
		this.dragMove(dx,dy);
		this.dragEnd();}
}


/*
Level.dragStart

Object level handler for
drag event initilization;
Adds attributes of orignal
coordinates to use for shifting
the shape during drag
*/
Level.prototype.dragStart = function() {
	//save orignal positions of children
	var itr = this.subtrees.begin();
	while(itr!=this.subtrees.end()) {
		itr.val.dragStart();
		itr = itr.next;
	}
	//save orignal positions of variables
	var itr = this.leaves.begin();
	while(itr!=this.leaves.end()) {
		itr.val.dragStart();
		itr = itr.next;
	}
	//save level's orignal position
	this.ox = this.shape.attr("x");
	this.oy = this.shape.attr("y");
};
//Level callback for drag initialization
Level.prototype.onDragStart = function() {
	this.parent.dragStart();
	//highlight shape
	this.attr({"fill-opacity": .2});
};


/*
Level.dragMove
~dx: drag difference in x
~dy: drag difference in y

Object level handler for
drag event action; shifts
shape based on drag difference
then drags children/variables
*/
Level.prototype.dragMove = function(dx, dy) {
	var new_x, new_y;

	this.collisionMove(dx,dy);

	//shift children
	var itr = this.subtrees.begin();
	while(itr!=this.subtrees.end()) {
		itr.val.dragMove(dx,dy);
		itr = itr.next;
	}
	//shift variables
	var itr = this.leaves.begin();
	while(itr!=this.leaves.end()) {
		itr.val.dragMove(dx,dy);
		itr = itr.next;
	}
	//move collided nodes out of way
	this.parent.shiftAdjacent(this,this.shape.getBBox());
	//fit hull to new area
	this.parent.expand(new_x,new_y,this.shape.attrs.width,this.shape.attrs.height);
	this.parent.contract();
};
//Level callback for dragging
Level.prototype.onDragMove = function(dx, dy) {
	this.parent.dragMove(dx,dy);
	this.paper.renderfix();
};



/*
Level.collisionMove
~dx: drag difference in x
~dy: drag difference in y

Object level handler for
drag event action; detects collisions
with the bounds of the plane.
*/
Level.prototype.collisionMove = function (dx, dy) {
	var width = this.paper.DEFAULT_PLANE_WIDTH;
	var height = this.paper.DEFAULT_PLANE_HEIGHT;
	var new_x, new_y, ox, oy, slack = 15;
	var shape_width = this.shape.attr("width");
	var shape_height = this.shape.attr("height");
	var bbox = this.shape.getBBox();
	ox = this.ox;
	oy = this.oy;
	new_x = ox + dx;
	new_y = oy + dy;

	//D("OX:"+ox + " DX"+dx + " SW2"+shape_width/2 + " | width:"+width + " total:"+(ox+dx+(shape_width)));
	
	// collision with right bound
	if (ox + dx + shape_width >= width) {
		new_x = width - shape_width;
	}
	// collision with bottom bound
	if (oy + dy + shape_height >= height) {
		new_y = height - shape_height;
	}
	// collision with left bound
	if (ox + dx <= 0) {
		new_x = 0;
	}
	// collision with upper bound
	if (oy + dy <= 0) {
		new_y = 0;
	}

	this.shape.attr({x: new_x, y: new_y});
}

/*
Level.dragEnd

Object level handler for
drag end event action;
Does final contraction of level
*/
Level.prototype.dragEnd = function() {
	this.parent.contract();
};
//Level callback for drag ending
Level.prototype.onDragEnd = function() {
	this.parent.dragEnd();
	this.attr({"fill-opacity": 0});
};


/*
Level.shiftAdjacent
~child: child to be shifted on own level
~bbox: bounding box of child

Shift all children on plane away from input child
when colliding on its bounding box
*/
Level.prototype.shiftAdjacent = function(child,bbox) {
	if(!child.visited){
		child.visited = true;
		var slack = 5;
		var itr = this.leaves.begin();
		while(itr!=this.leaves.end()){
			var c = itr.val;
			if(child !== c && !(c.visited)) {
				var bbox2 = c.text.getBBox();
				if(this.paper.raphael.isBBoxIntersect(bbox,bbox2)) {

					var sx = 0, sy = 0;
					var dx = Math.min(bbox2.x2-bbox.x,bbox.x2-bbox2.x);
					var dy = Math.min(bbox2.y2-bbox.y,bbox.y2-bbox2.y);
					var width = this.paper.DEFAULT_PLANE_WIDTH;
					var height = this.paper.DEFAULT_PLANE_HEIGHT;

					// if bbox2 is already colliding with the upper
					// prevents bbox from intersecting with bbox2
					if (bbox2.y <= 0) {
						// if bbox is colliding with bbox2 on the right
						if (bbox.x > bbox2.x && bbox.x < bbox2.x2) {
							sx = (dx+slack)*-1;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the left side
						} else if (bbox.x2 < bbox2.x2 && bbox.x2 > bbox2.x) {
							sx = dx-slack;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the bottom
						} else {
							sy = dy+slack;
							child.drag(sx,sy);
						}
					}
					// if bbox2 is already colliding with the left bound
					else if (bbox2.x <= 0) {
						// if bbox is colliding with bbox2 on the top
						if (bbox.y2 > bbox2.y && bbox.y2 < bbox2.y2) {
							sy = dy-slack;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the bottom
						} else if (bbox.y < bbox2.y2 && bbox.y > bbox2.y) {
							sy = (dy+slack)*-1;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the right
						} else {
							sy = dy+slack;
							child.drag(sx,sy)
						}
					}
					// if bbox2 is already colliding with the right bound
					else if (bbox2.x2 >= width) {
						// if bbox is colliding with bbox2 on the top
						if (bbox.y2 > bbox2.y && bbox.y2 < bbox2.y2) {
							sy = dy+slack;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the bottom
						} else if (bbox.y < bbox2.y2 && bbox.y > bbox2.y) {
							sy = (dy-slack)*-1;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the right
						} else {
							sy = dy+slack;
							child.drag(sx,sy)
						}
					}
					// if bbox2 is already colliding with the lower bound
					else if (bbox2.y2 >= height) {
						// if bbox is colliding with bbox2 on the right
						if (bbox.x >= bbox2.x && bbox.x <= bbox2.x2) {
							sx = (dx-slack)*-1;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the left side
						} else if (bbox.x2 <= bbox2.x2 && bbox.x2 >= bbox2.x) {
							sx = dx+slack;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the bottom
						} else {
							sy = dy+slack;
							child.drag(sx,sy);
						}
					}
					// Otherwise, bbox2 is not colliding with any edge and must be
					// in the center of the plane.
					else {
						// bbox hitting upper bound
						if (bbox2.y-dy <= 0)
							sy = -1*bbox2.y;
						// bbox hitting left bound
						else if (bbox2.x-dx <= 0)
							sx = -1*bbox2.x;
						// bbox hitting lower bound
						else if (bbox2.y2+dy >= height) {
							if (bbox2.y2 <= height) sy = height-bbox2.y2;
							else sy = 0;
						}
						// bbox hitting right bound
						else if (bbox2.x2+dx >= width) {
							if (bbox2.x2 <= width) sx = width-bbox2.x2;
							else sx = 0;
						}

						else if (dx >= bbox.x2-bbox.x || dx >= bbox2.x2-bbox2.x)
							sy = (dy+slack)*(bbox2.y <= bbox.y ? -1:1);
						else if (dy >= bbox.y2-bbox.y || dy >= bbox2.y2-bbox2.y)
							sx = (dx+slack)*(bbox2.x <= bbox.x ? -1:1);
						else {
							if(dx<dy)
								sx = (dx+slack)*(bbox2.x <= bbox.x ? -1:1);

							else
								sy = (dy+slack)*(bbox2.y <= bbox.y ? -1:1);
						}
						c.drag(sx,sy);
					}
				}
			}
			itr = itr.next;
		}
		var itr = this.subtrees.begin();
		while(itr!=this.subtrees.end()){
			var c = itr.val;
			if(child !== c && !(c.visited)) {
				var bbox2 = c.shape.getBBox();
				if(this.paper.raphael.isBBoxIntersect(bbox,bbox2)) {

					var sx = 0, sy = 0;
					var dx = Math.min(bbox2.x2-bbox.x,bbox.x2-bbox2.x);
					var dy = Math.min(bbox2.y2-bbox.y,bbox.y2-bbox2.y);
					var width = this.paper.DEFAULT_PLANE_WIDTH;
					var height = this.paper.DEFAULT_PLANE_HEIGHT;

					// if bbox2 is already colliding with the upper
					// prevents bbox from intersecting with bbox2
					if (bbox2.y <= 0) {
						// if bbox is colliding with bbox2 on the right
						if (bbox.x > bbox2.x && bbox.x < bbox2.x2) {
							sx = (dx+slack)*-1;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the left side
						} else if (bbox.x2 < bbox2.x2 && bbox.x2 > bbox2.x) {
							sx = dx-slack;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the bottom
						} else if (bbox.y < bbox2.y2 && bbox.y > bbox2.y) {
							sy = dy+slack;
							child.drag(sx,sy);
						}
					}
					// if bbox2 is already colliding with the left bound
					else if (bbox2.x <= 0) {
						// if bbox is colliding with bbox2 on the top
						if (bbox.y2 > bbox2.y && bbox.y2 < bbox2.y2) {
							sy = dy-slack;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the bottom
						} else if (bbox.y < bbox2.y2 && bbox.y > bbox2.y) {
							sy = (dy+slack)*-1;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the right
						} else {
							sy = dy+slack;
							child.drag(sx,sy)
						}
					}
					// if bbox2 is already colliding with the right bound
					else if (bbox2.x2 >= width) {
						// if bbox is colliding with bbox2 on the top
						if (bbox.y2 > bbox2.y && bbox.y2 < bbox2.y2) {
							sy = dy+slack;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the bottom
						} else if (bbox.y < bbox2.y2 && bbox.y > bbox2.y) {
							sy = (dy-slack)*-1;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the right
						} else {
							sy = dy+slack;
							child.drag(sx,sy)
						}
					}
					// if bbox2 is already colliding with the lower bound
					else if (bbox2.y2 >= height) {
						// if bbox is colliding with bbox2 on the right
						if (bbox.x > bbox2.x && bbox.x < bbox2.x2) {
							sx = (dx+slack)*-1;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the left side
						} else if (bbox.x2 < bbox2.x2 && bbox.x2 > bbox2.x) {
							sx = dx-slack;
							c.drag(sx,sy);
						// if bbox is colliding with bbox2 on the bottom
						} else {
							sy = dy+slack;
							child.drag(sx,sy);
						}
					}
					// Otherwise, bbox2 is not colliding with any edge and must be
					// in the center of the plane.
					else {
						// bbox hitting upper bound
						if (bbox2.y-dy <= 0)
							sy = -1*bbox2.y;
						// bbox hitting left bound
						else if (bbox2.x-dx <= 0)
							sx = -1*bbox2.x;
						// bbox hitting lower bound
						else if (bbox2.y2+dy >= height) {
							if (bbox2.y2 <= height) sy = height-bbox2.y2;
							else sy = 0;
						}
						// bbox hitting right bound
						else if (bbox2.x2+dx >= width) {
							if (bbox2.x2 <= width) sx = width-bbox2.x2;
							else sx = 0;
						}

						else if (dx >= bbox.x2-bbox.x || dx >= bbox2.x2-bbox2.x)
							sy = (dy+slack)*(bbox2.y <= bbox.y ? -1:1);
						else if (dy >= bbox.y2-bbox.y || dy >= bbox2.y2-bbox2.y)
							sx = (dx+slack)*(bbox2.x <= bbox.x ? -1:1);
						else {
							if(dx<dy)
								sx = (dx+slack)*(bbox2.x <= bbox.x ? -1:1);

							else
								sy = (dy+slack)*(bbox2.y <= bbox.y ? -1:1);
						}
						c.drag(sx,sy);
					}
					
				}
			}
			itr = itr.next;
		}
		child.visited = false;
	}
}
