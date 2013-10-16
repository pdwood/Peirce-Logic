/*
Variable: Propostional variable, inherits from Node
~text: Raphael text
*/
Variable.prototype = Object.create(Node.prototype);

function Variable(R,parent,x,y,duplicate,variable_name) {
	Object.getPrototypeOf(Variable.prototype).constructor.call(this,parent);

	this.paper = R;

	if(!duplicate) {
		if(variable_name) {
			this.setText(variable_name);
		} else {
			//initial text, can't be empty or else it defaults to 0,0 origin
			this.text = this.paper.text(x,y+45-PLANE_VOFFSET,"").attr({"font-size":20});
			text = this.text;
			this.text.parent = this;

			//setup text initialization
			smoke.prompt('Enter Variable Name',function(e){
				var text_string =  "";
				if(e){
					text_string = e.replace(/^\s+|\s+$/g,"");
				}
				if(!text_string.length) { //if not valid string, just white space
					text_string = "EMPTY VARIABLE";
				}

				text.parent.setText(text_string);	
			});
		}

		this.text.drag(this.onDragMove,this.onDragStart,this.onDragEnd);
		this.text.click(function(e) {ContextMenu.SingleClickHandler(this.parent,e);});
		this.text.mousedown(function(e) {
			if (e.which == 3) {
				this.parent.onRightClick(e);
			}
		});
	}
}

/*
Variable.setText
~variable_name: String for variable

Add string for variable
*/
Variable.prototype.setText = function(variable_name) {
	//initialize and add variable to parent
	this.text.attr({'text':variable_name});
	this.parent.leaves.push_back(this);

	this.parent.expand(this.text.getBBox().x, this.text.getBBox().y, this.text.getBBox().width, this.text.getBBox().height,true);
	this.parent.contract();
	//move collided nodes out of way
	this.parent.shiftAdjacent(this,this.text.getBBox());
	this.parent.expand(this.text.getBBox().x, this.text.getBBox().y, this.text.getBBox().width, this.text.getBBox().height,true);
	this.parent.contract();
}

/*
Variable.renderText
~attr: Raphael attributes for rendering

Remove old rapheal text and
replace with new text with
input attributes and setup
handlers
*/
Variable.prototype.renderText = function(attr) {
	if(this.text) {
		this.text.remove();
		this.text = null;
	}

	this.text = this.paper.text(0,0,"~").attr(attr);
	this.text.parent = this;


	this.text.drag(this.onDragMove,this.onDragStart,this.onDragEnd);
	this.text.click(function(e) {ContextMenu.SingleClickHandler(this.parent,e);});
	this.text.dblclick(this.onDoubleClick);
};

Variable.prototype.updateLevel = function() {
	this.text.toFront();
};

Variable.prototype.getName = function() {
	return this.text.attr('text');
};

/*
Variable.compress

Save text attributes
and remove text from
variable and screen;
Used in saving a tree
for later use
*/
Variable.prototype.compress = function() {
	this.saved_attr = jQuery.extend(true, {}, this.text.attrs);
	this.text.remove();
	this.text = null;
};

/*
Variable.restore

Re-render text from
saved text attributes
*/
Variable.prototype.restore = function() {
	if(this.saved_attr) { //check if saved attributes exist
		this.renderText(this.saved_attr);
	}
};

Variable.prototype.drag = function(dx,dy) {
	this.dragStart();
	this.dragMove(dx,dy);
	this.dragEnd();
};

/*
Variable.dragStart

Object variable handler for
drag event initilization;
Adds attributes of orignal
coordinates to use for shifting
the text during drag
*/
Variable.prototype.dragStart = function() {
	//save Variable's orignal position
	this.ox = this.text.attr("x");
	this.oy = this.text.attr("y");
};
//Variable callback for drag initialization
Variable.prototype.onDragStart = function() {
	this.parent.dragStart();
};

/*
Variable.dragMove
~dx: drag difference in x
~dy: drag difference in y

Object variable handler for
drag event action; shifts
text based on drag difference
*/
Variable.prototype.dragMove = function(dx, dy) {
	//shift text
	var new_x, new_y;
	//if (this.isOutOfBounds()) {
		this.collisionMove(dx,dy);
	//} else {
	//	new_x = this.ox + dx;
	//	new_y = this.oy + dy;
	//	this.text.attr({x: new_x, y: new_y});
	//}
	//fit parent hull to new area
	this.parent.expand(this.text.getBBox().x,this.text.getBBox().y,this.text.getBBox().width,this.text.getBBox().height);
	this.parent.contract();

	//move collided nodes out of way
	this.parent.shiftAdjacent(this,this.text.getBBox());
	minimap.redraw();
};
//Variable callback for dragging
Variable.prototype.onDragMove = function(dx, dy) {
	this.parent.dragMove(dx,dy);
	this.paper.renderfix();
};

/*
Variable.dragEnd

Object variable handler for
drag end event action;
Does final contraction of Variable
*/
Variable.prototype.dragEnd = function() {
	this.parent.contract();
};
//Variable callback for drag ending
Variable.prototype.onDragEnd = function() {
	this.parent.dragEnd();
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
	var bbox = this.text.getBBox();
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
	this.text.attr({x: new_x, y: new_y});
};

/*
Variable.isOutOfBounds

Detects if the variable is colliding with
the sides of the plane.

Returns true is it is, returns false otherwise.
*/
Variable.prototype.isOutOfBounds = function () {
	if (this.parent && this.parent.parent) return this.parent.isOutOfBounds();

	var bbox = this.text.getBBox();
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

/*
Variable.onRightClick
~event: mouse event

Object variable handler for
mouse right click action;
Creates context menu on node;
*/
Variable.prototype.onRightClick = function(event) {
	if (!event.ctrlKey) {
		//Menu intialized with node,node's level, and mouse x/y
		ContextMenu.NewContext(this, this.ox, this.oy);
	}
};

/*
Variable.duplicate

Variable deep copy
*/
Variable.prototype.duplicate = function() {
	var dup = new Variable(this.paper,null,0,0,true);
	dup.id = this.id;
	dup.id_gen = this.id_gen;
	if(!this.saved_attr){
		dup.saved_attr = jQuery.extend(true, {}, this.text.attrs);
	}
	else{
		dup.saved_attr = this.saved_attr;
	}
	return dup;
};


Variable.prototype.setClickActive = function(flag) {
	if(!flag)
		this.text.attr({"stroke-width": "0"});
	else
		this.text.attr({"stroke-width": "2"});
		this.text.attr({"stroke": "#000000"});
};
