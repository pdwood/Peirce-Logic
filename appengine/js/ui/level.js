Level.prototype = Object.create(UINode.prototype);

function Level(R, node, nodeDict) {
    this.superClass = Object.getPrototypeOf(Level.prototype);	
    this.superClass.constructor.call(this,R,node,nodeDict);
}

Level.prototype.createShape = function(attr) {
	this.removeShape();
	this.shape = this.paper.rect(0,0,1,1);
	
    if(this.node.parent) { // cuts
		//mouseover effects
        this.shape.mouseover(function () {
            this.attr({"fill-opacity": 0.2});
        });
		this.shape.mouseout(function () {
			this.attr({"fill-opacity": 0.0}); 
        });
		
		this.shape.drag(this.onDragMove,this.onDragStart,this.onDragEnd);
	}    

	this.shape.parent = this;
	this.shape.click(function(e) {ContextMenu.SingleClickHandler(this.parent,e);});
    $(document).bind('contextmenu', function(e) {
        e.preventDefault();
    });
    this.shape.mousedown(function(e) {
        if (e.which == 3) {
            this.parent.clicked(e);
        }
    });

    this.setShapeAttr(attr);
}

Level.prototype.defaultAttr = function() {
    // plane
    if(!this.node.parent) {
        var color = '#888';
		return {
            x: 0,
            y: 0,
            width: DEFAULT_PLANE_WIDTH,
            height: DEFAULT_PLANE_HEIGHT,
			fill: color,
			stroke: color, "fill-opacity": 0.1
		};
    } else { // cut
        //color spectrum based on level
		var color = 0; 
        Raphael.getColor.reset();
		for(var x =1; x<=this.node.getLevel()+1;x++){
			color = Raphael.getColor();
		}
		return {
            x: 0,
            y: 0,
            width: DEFAULT_CHILD_WIDTH,
            height: DEFAULT_CHILD_HEIGHT,
            r: DEFAULT_CURVATURE,
            fill: color,
			stroke: color, "fill-opacity": 0
        };
    }
}

/* to be most likely removed 
Level.prototype.removeNode = function(node) {
	var parent_list = null;
	if(node instanceof Level) {
		parent_list = this.subtrees;
	}
	else {
		parent_list = this.leaves;
	}

	var itr = parent_list.skipUntil(function(x) {
		return (x === node);
	});

	if(node instanceof Level) {
		itr.val.compressTree();
	}
	else {
		itr.val.compress();
	}
	parent_list.erase(itr);
	node.parent = null;
	this.contract(true);
};
*/

Level.prototype.setSelected = function(flag) {
	if(!flag)
		this.setShapeAttr({"stroke-width": 1});
	else
		this.setShapeAttr({"stroke-width": 3});
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
    if(this.node.parent) {
        var sc = 20; //padding
        //initial state
        var x = this.shape.attrs.x;
        var y = this.shape.attrs.y;
        var w = this.shape.attrs.width;
        var h = this.shape.attrs.height;
        //expanded x,y
        var new_x = x; var new_y = y;
        //child is out of bounds on left

        if(x > cx-sc) {
            new_x = cx-sc;
            //match width to expansion
            w += x-new_x;
        }
        //child is out of bounds on top
        if(y > cy-sc) { 
            new_y = cy-sc;
            //match height to expansion
            h += y-new_y;
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
            height: new_height
        };
        if(animate)
            this.shape.animate(expanded_att,200,"<");
        this.setShapeAttr(expanded_att);

        //expand parent
        this.getUINode(this.node.parent).expand(new_x,new_y,new_width,new_height,animate);

        //move collided nodes out of way
        this.getUINode(this.node.parent).shiftAdjacent(this,this.shape.getBBox());
    }
};


/*
Level.contract

Takes level's shape and
contracts its around all
children and variables like a hull;
*/
Level.prototype.contract = function(animate) {
    if(this.node.parent) {
        var sc = 20; //padding
        //state variables
        var new_x = this.shape.attrs.x+(this.shape.attrs.width)/4;
        var new_y = this.shape.attrs.y+(this.shape.attrs.height)/4;
        var new_width = DEFAULT_CHILD_WIDTH, new_height = DEFAULT_CHILD_HEIGHT;
        var initial_hull_set_flag = false; //flag for hull initilization

        if(this.node.subtrees.length) { //if children
            //intial hull around first child with slack
            var itr = this.node.subtrees.begin();
            var cx = this.getUINode(itr.val).shape.attrs.x; var cy = this.getUINode(itr.val).shape.attrs.y;
            var cw = this.getUINode(itr.val).shape.attrs.width; var ch = this.getUINode(itr.val).shape.attrs.height;
            //contracted properties
            new_x = cx-sc; 
            new_y = cy-sc;
            new_width = cw+sc+sc;
            new_height = ch+sc+sc;
            initial_hull_set_flag = true;
            itr = itr.next; //move to next child
            while(itr!=this.node.subtrees.end()) {
                //fit hull
                cx = this.getUINode(itr.val).shape.attrs.x;
                cy = this.getUINode(itr.val).shape.attrs.y;
                cw = this.getUINode(itr.val).shape.attrs.width;
                ch = this.getUINode(itr.val).shape.attrs.height;
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

        //if variables
        if(this.node.leaves.length) {
            var itr = this.node.leaves.begin();
            //if hull not initialized
            if(!initial_hull_set_flag) {
                //intial hull around first variable with slack
                var cx = this.getUINode(itr.val).shape.getBBox().x, cy = this.getUINode(itr.val).shape.getBBox().y;
                var cw = this.getUINode(itr.val).shape.getBBox().width, ch = this.getUINode(itr.val).shape.getBBox().height;
                //contracted properties
                new_x = cx-sc;
                new_y = cy-sc;
                new_width = cw+sc+sc;
                new_height = ch+sc+sc;
                //move to next variable
                itr = itr.next;
            }
            while(itr!=this.node.leaves.end()) {
                //fit hull
                var cx = this.getUINode(itr.val).shape.getBBox().x, cy = this.getUINode(itr.val).shape.getBBox().y;
                var cw = this.getUINode(itr.val).shape.getBBox().width, ch = this.getUINode(itr.val).shape.getBBox().height;
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
        this.setShapeAttr(expanded_att);

        //contract parent
        this.getUINode(this.node.parent).contract(animate);
    }
};

Level.prototype.touchend = function(dx,dy) {
	
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
    var itr = this.node.subtrees.begin();
    while(itr!=this.node.subtrees.end()) {
        this.getUINode(itr.val).dragStart();
        itr = itr.next;
    }
    //save orignal positions of variables
    itr = this.node.leaves.begin();
    while(itr!=this.node.leaves.end()) {
        this.getUINode(itr.val).dragStart();
        itr = itr.next;
    }
    //save level's orignal position
    this.ox = this.shape.attr("x");
    this.oy = this.shape.attr("y");

    //highlight shape
    this.setShapeAttr({"fill-opacity": 0.2});

    this.superClass.dragStart.call(this);
};

Level.prototype.dragMove = function(dx, dy) {
    var new_x, new_y;

    this.collisionMove(dx,dy);

    //shift children
    var itr = this.node.subtrees.begin();
    while(itr!=this.node.subtrees.end()) {
        this.getUINode(itr.val).dragMove(dx,dy);
        itr = itr.next;
    }
    //shift variables
    itr = this.node.leaves.begin();
    while(itr!=this.node.leaves.end()) {
        this.getUINode(itr.val).dragMove(dx,dy);
        itr = itr.next;
    }
    //move collided nodes out of way
    this.getUINode(this.node.parent).shiftAdjacent(this,this.shape.getBBox());
    //fit hull to new area
    this.getUINode(this.node.parent).expand(new_x,new_y,this.shape.attrs.width,this.shape.attrs.height);
    this.getUINode(this.node.parent).contract();

    this.superClass.dragMove.call(this,dx,dy);
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
    var width = DEFAULT_PLANE_WIDTH;
    var height = DEFAULT_PLANE_HEIGHT;
    var shape_width = this.shape.attr("width");
    var shape_height = this.shape.attr("height");
    var bbox = this.shape.getBBox();
    var slack = 20;

    /* find root */
    var padding = slack*(this.node.getLevel()-1);

    var ox = this.ox;
    var oy = this.oy;
    var new_x = this.ox + dx;
    var new_y = this.oy + dy;

    // collision with right bound
    if (ox + dx + shape_width + padding >= width) {
        new_x = width - shape_width - padding;
    }
    // collision with bottom bound
    if (oy + dy + shape_height + padding >= height) {
        new_y = height - shape_height - padding;
    }
    // collision with left bound
    if (ox + dx <= padding) {
        new_x = padding;
    }
    // collision with upper bound
    if (oy + dy <= padding) {
        new_y = padding;
    }

    this.setShapeAttr({x: new_x, y: new_y});
};

Level.prototype.dragEnd = function() {
    this.getUINode(this.node.parent).contract();
    this.setShapeAttr({"fill-opacity": 0});

    this.superClass.dragEnd.call(this);
};


/*
Level.shiftAdjacent
~child: child to be shifted on own level
~bbox: bounding box of child

Shift all children on plane away from input child
when colliding on its bounding box
*/
Level.prototype.shiftAdjacent = function(child,bbox) {
   if(!child.visited) {
        child.visited = true;
        var slack = 5;
        var itr = this.node.leaves.begin();
        while(itr!=this.node.leaves.end()) {
            var c = this.getUINode(itr.val);
            if(child !== c && !(c.visited)) {
                var bbox2 = c.shape.getBBox();
                if(this.R.raphael.isBBoxIntersect(bbox,bbox2)) {      
                    var sx = 0, sy = 0;
                    var dx = Math.min(bbox2.x2-bbox.x,bbox.x2-bbox2.x);
                    var dy = Math.min(bbox2.y2-bbox.y,bbox.y2-bbox2.y);
                    var width = DEFAULT_PLANE_WIDTH;
                    var height = DEFAULT_PLANE_HEIGHT;

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
                            child.drag(sx,sy);
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
                            child.drag(sx,sy);
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
        itr = this.node.subtrees.begin();
        while(itr!=this.node.subtrees.end()) {
            var c = this.getUINode(itr.val);
            if(child !== c && !(c.visited)) {
                var bbox2 = c.shape.getBBox();
                if(this.paper.raphael.isBBoxIntersect(bbox,bbox2)) {
                    var sx = 0, sy = 0;
                    var dx = Math.min(bbox2.x2-bbox.x,bbox.x2-bbox2.x);
                    var dy = Math.min(bbox2.y2-bbox.y,bbox.y2-bbox2.y);
                    var width = DEFAULT_PLANE_WIDTH;
                    var height = DEFAULT_PLANE_HEIGHT;

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
                            child.drag(sx,sy);
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
                            child.drag(sx,sy);
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
 
