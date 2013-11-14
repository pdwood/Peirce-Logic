Variable.prototype = Object.create(UINode.prototype);

function Variable(R, node, nodeDict) {
    this.superClass = Object.getPrototypeOf(Variable.prototype);
	this.superClass.constructor.call(this,R,node,nodeDict);
}

/*
Variable.prototype.createShape = function(attr) {
    this.shape = this.R.text(0,0,"").attr(attr);
	this.shape.parent = this;

    if(attr.text && attr.length <= 0){
		text = this.shape;
		//setup text initialization
		smoke.prompt('Enter Variable Name',function(e){
			var text_string =  "";
			if(e){
				text_string = e.replace(/^\s+|\s+$/g,"");
			}
			if(!text_string.length) { //if not valid string, just white space
				text_string = "EMPTY VARIABLE";
			}
            this.shape.attr({text:text_string});
			text.parent.node.context = text_string;	
		});
	} else {
        this.node.context = attr.text;
    }

	this.shape.drag(this.onDragMove,this.onDragStart,this.onDragEnd);
	this.shape.click(function(e) {ContextMenu.SingleClickHandler(this.parent,e);});
	this.shape.dblclick(this.clicked);
}
*/

Variable.prototype.createShape = function(attr) {
    this.removeShape();
	this.shape = this.paper.text(0,0,"~")
    this.setShapeAttr(attr);
	this.shape.parent = this;

	this.shape.drag(this.onDragMove,this.onDragStart,this.onDragEnd);
	this.shape.click(function(e) {ContextMenu.SingleClickHandler(this.parent,e);});
    $(document).bind('contextmenu', function(e) {
        e.preventDefault();
    });
    this.shape.mousedown(function(e) {
        if (e.which == 3) {
            this.parent.clicked(e);
        }
    });

};

Variable.prototype.setClickActive = function(flag) {
	if(!flag)
		this.shape.attr({"stroke-width": "0"});
	else
		this.shape.attr({"stroke-width": "2"});
		this.shape.attr({"stroke": "#000000"});
};

Variable.prototype.dragStart = function() {
	//save Variable's orignal position
	this.ox = this.shape.attr("x");
	this.oy = this.shape.attr("y");

    this.superClass.dragStart.call(this);
};

Variable.prototype.dragMove = function(dx, dy) {
	//shift text
	var new_x, new_y;
	//if (this.isOutOfBounds()) {
	this.collisionMove(dx,dy);
	//} else {
	//	new_x = this.ox + dx;
	//	new_y = this.oy + dy;
	//	this.shape.attr({x: new_x, y: new_y});
	//}
	//fit parent hull to new area
	this.getUINode(this.node.parent).expand(this.shape.getBBox().x,this.shape.getBBox().y,this.shape.getBBox().width,this.shape.getBBox().height);
	this.getUINode(this.node.parent).contract();

	//move collided nodes out of way
	this.getUINode(this.node.parent).shiftAdjacent(this,this.shape.getBBox());

    this.superClass.dragMove.call(this,dx,dy);
};

Variable.prototype.dragEnd = function() {
	this.getUINode(node.parent).shape.contract();

    this.superClass.dragEnd.call(this);
};

/*
Variable.collisionMove
~dx: drag difference in x
~dy: drag difference in y

Object level handler for
drag event action; detects collisions
with the bounds of the plane.
*/
Variable.prototype.collisionMove = function (dx, dy) {
	var width = DEFAULT_PLANE_WIDTH;
	var height = DEFAULT_PLANE_HEIGHT;
	var new_x, new_y, slack = 1;
	var bbox = this.shape.getBBox();
	var shape_width = bbox.width;
	var shape_height = bbox.height;
	var ox = this.ox;
	var oy = this.oy;

	new_x = ox + dx;
	new_y = oy + dy;

	//D("OX:"+ox + " DX"+dx + " SW2"+shape_width/2 + " | width:"+width + " total:"+(ox+dx-(shape_width/2)));

	// collision with right bound
	if (ox + dx + shape_width/2 >= width) {
		new_x = (width-shape_width/2)-slack;
	}
	// collision with bottom bound
	if (oy + dy + shape_height/2 >= height) {
		new_y = (height-shape_height/2)-slack;
	}
	// collision with left bound
	if (ox + dx - shape_width/2 < 0) {
		new_x = shape_width/2;
	}
	// collision with upper bound
	if (oy + dy <= 0) {
		new_y = slack + shape_height/2;
	}
	this.setShapeAttr({x: new_x, y: new_y});
};

/*
Variable.isOutOfBounds

Detects if the variable is colliding with
the sides of the plane.

Returns true is it is, returns false otherwise.
*/
Variable.prototype.isOutOfBounds = function () {
	if (this.node.parent && this.node.parent.parent) 
        return this.getUINode(this.node.parent).isOutOfBounds();

	var bbox = this.shape.getBBox();
	var slack = 5;
	var width = DEFAULT_PLANE_WIDTH;
	var height = DEFAULT_PLANE_HEIGHT;
	var shape_width = bbox.width;
	var shape_height = bbox.height;

	// Colliding with left bound
	if (bbox.x <= shape_width/2) return true;
	// Colliding with right bound
	if (bbox.x2+shape_width/2 >= width) return true;
	// Colliding with upper bound
	if (bbox.y-shape_height/2 <= 0) return true;
	// Colliding with lower bound
	if (bbox.y2+shape_height/2 >= height) return true;
	return false;
};
