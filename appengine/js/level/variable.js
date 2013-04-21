<<<<<<< HEAD
/*
Variable: Propostional variable, inherits from Node
~text: Raphael text
*/
Variable.prototype = Object.create(Node.prototype);

function Variable(R,parent,x,y,duplicate) {
	Object.getPrototypeOf(Variable.prototype).constructor.call(this,parent);

	this.paper = R;

	if(!duplicate) {
		//initial text, can't be empty or else it defaults to 0,0 origin
		this.text = this.paper.text(x,y-PLANE_VOFFSET,"~").attr({"font-size":20});
		text = this.text;
		this.text.parent = this;

		//setup text initialization
		var w=100,h=16; //dimensions of text box
		//create div with inner text box
		var text_box = $('<div> <input style="height:' + h + 'px; width: ' + w + 'px;" type="text" name="textbox" value=""></div>');
		//center over text area
		text_box.css({"z-index" : 2, "position" : "absolute"});
		//text_box.css("left",this.text.getBBox().x-w/2+8);
		//text_box.css("top",this.text.getBBox().y+19);
		text_box.css("left",(this.text.getBBox().x-(w/2)+8));
		text_box.css("top",(this.text.getBBox().y-6) + PLANE_VOFFSET );
		//text creation function
		var text_evaluate = function() {
			//get rid extraneous pre/post white space
			var text_string = this.children[0].value.replace(/^\s+|\s+$/g,"");
			try {
				this.parentNode.removeChild(this); //remove div
				if(!text_string.length) { //if not valid string, just white space
					text_string = "EMPTY VARIABLE";
				}
				//initialize and add variable to parent
				text.attr({'text':text_string});
				text.parent.parent.leaves.push_back(text.parent);

				text.parent.parent.expand(text.getBBox().x, text.getBBox().y, text.getBBox().width, text.getBBox().height,true);
				text.parent.parent.contract();
				//move collided nodes out of way
				text.parent.parent.shiftAdjacent(text.parent,text.getBBox());
				text.parent.parent.expand(text.getBBox().x, text.getBBox().y, text.getBBox().width, text.getBBox().height,true);
				text.parent.parent.contract();
			}
			catch(e){} //catch all needed in case div removed before function finishes
		};
		text_box.focusout( text_evaluate ); //evaluate text on focus out of text box
		text_box.keyup(function(event){
			if(event.keyCode == 13){
				text_evaluate.apply(this);
			}
		});
		//need to enter based evaluation
		$("body").append(text_box); //insert text box into page
		$(text_box).children()[0].focus(); //focus on text box

		this.text.drag(this.onDragMove,this.onDragStart,this.onDragEnd);
		this.text.click(function(e) {ContextMenu.SingleClickHandler(this.parent,e);});
		this.text.dblclick(this.onDoubleClick);
	}
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
}

/*
Variable.restore

Re-render text from
saved text attributes
*/
Variable.prototype.restore = function() {
	if(this.saved_attr) { //check if saved attributes exist
		this.renderText(this.saved_attr)
	}
}

Variable.prototype.drag = function(dx,dy) {
	this.dragStart();
	this.dragMove(dx,dy);
	this.dragEnd();
}

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
	var new_x = this.ox + dx;
	var new_y = this.oy + dy;
	this.text.attr({x: new_x, y: new_y});
	//fit parent hull to new area
	this.parent.expand(this.text.getBBox().x,this.text.getBBox().y,this.text.getBBox().width,this.text.getBBox().height);
	this.parent.contract();

	//move collided nodes out of way
	this.parent.shiftAdjacent(this,this.text.getBBox());
};
//Variable callback for dragging
Variable.prototype.onDragMove = function(dx, dy) {
	this.parent.dragMove(dx,dy);
	this.paper.renderfix()
};

/*
Variable.dragEnd

Object variable handler for
drag end event action;
Does final contraction of Variable
*/
Variable.prototype.dragEnd = function() {
	this.parent.contract();
}
//Variable callback for drag ending
Variable.prototype.onDragEnd = function() {
	this.parent.dragEnd();
};

/*
Variable.onDoubleClick
~event: mouse event

Object variable handler for
mouse double click action;
Creates context menu on node;
*/
Variable.prototype.onDoubleClick = function(event) {
	if (!event.ctrlKey) {
		//Menu intialized with node,node's level, and mouse x/y
		ContextMenu.NewContext(this.parent,this.attrs.x,this.attrs.y);
	}
};

/*
Variable.duplicate

Variable deep copy
*/
Variable.prototype.duplicate = function() {
	var dup = new Variable(this.paper,null,0,0,true);
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

=======
/*
Variable: Propostional variable, inherits from Node
~text: Raphael text
*/
Variable.prototype = Object.create(Node.prototype);

function Variable(R,parent,x,y,duplicate) {
	Object.getPrototypeOf(Variable.prototype).constructor.call(this,parent);

	this.paper = R;

	if(!duplicate) {
		//initial text, can't be empty or else it defaults to 0,0 origin
		this.text = this.paper.text(x,y+45-PLANE_VOFFSET,"~").attr({"font-size":20});
		text = this.text;
		this.text.parent = this;

		//setup text initialization
		var w=100,h=16; //dimensions of text box
		//create div with inner text box
		var text_box = $('<div> <input style="height:' + h + 'px; width: ' + w + 'px;" type="text" name="textbox" value=""></div>');
		//center over text area
		text_box.css({"z-index" : 2, "position" : "absolute"});
		//text_box.css("left",this.text.getBBox().x-w/2+8);
		//text_box.css("top",this.text.getBBox().y+19);
		text_box.css("left",(this.text.getBBox().x-(w/2)));
		text_box.css("top",(this.text.getBBox().y) + PLANE_VOFFSET );
		//text creation function
		var text_evaluate = function() {
			//get rid extraneous pre/post white space
			var text_string = this.children[0].value.replace(/^\s+|\s+$/g,"");
			try {
				this.parentNode.removeChild(this); //remove div
				if(!text_string.length) { //if not valid string, just white space
					text_string = "EMPTY VARIABLE";
				}
				//initialize and add variable to parent
				text.attr({'text':text_string});
				text.parent.parent.leaves.push_back(text.parent);

				text.parent.parent.expand(text.getBBox().x, text.getBBox().y, text.getBBox().width, text.getBBox().height,true);
				text.parent.parent.contract();
				//move collided nodes out of way
				text.parent.parent.shiftAdjacent(text.parent,text.getBBox());
				text.parent.parent.expand(text.getBBox().x, text.getBBox().y, text.getBBox().width, text.getBBox().height,true);
				text.parent.parent.contract();
			}
			catch(e){} //catch all needed in case div removed before function finishes
		};
		text_box.focusout( text_evaluate ); //evaluate text on focus out of text box
		text_box.keyup(function(event){
			if(event.keyCode == 13){
				text_evaluate.apply(this);
			}
		});
		//need to enter based evaluation
		$("body").append(text_box); //insert text box into page
		$(text_box).children()[0].focus(); //focus on text box

		this.text.drag(this.onDragMove,this.onDragStart,this.onDragEnd);
		this.text.click(function(e) {ContextMenu.SingleClickHandler(this.parent,e);});
		this.text.dblclick(this.onDoubleClick);
	}
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
}

/*
Variable.restore

Re-render text from
saved text attributes
*/
Variable.prototype.restore = function() {
	if(this.saved_attr) { //check if saved attributes exist
		this.renderText(this.saved_attr)
	}
}

Variable.prototype.drag = function(dx,dy) {
	this.dragStart();
	this.dragMove(dx,dy);
	this.dragEnd();
}

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
};
//Variable callback for dragging
Variable.prototype.onDragMove = function(dx, dy) {
	this.parent.dragMove(dx,dy);
	this.paper.renderfix()
};

/*
Variable.dragEnd

Object variable handler for
drag end event action;
Does final contraction of Variable
*/
Variable.prototype.dragEnd = function() {
	this.parent.contract();
}
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
	var width = this.text.paper.DEFAULT_PLANE_WIDTH;
	var height = this.text.paper.DEFAULT_PLANE_HEIGHT;
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
	var width = this.text.paper.DEFAULT_PLANE_WIDTH;
	var height = this.text.paper.DEFAULT_PLANE_HEIGHT;
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
Variable.onDoubleClick
~event: mouse event

Object variable handler for
mouse double click action;
Creates context menu on node;
*/
Variable.prototype.onDoubleClick = function(event) {
	if (!event.ctrlKey) {
		//Menu intialized with node,node's level, and mouse x/y
		ContextMenu.NewContext(this.parent, (this.attrs.x-this.paper.zoomOffset()[0])/this.paper.zoomScale()[0],
											(this.attrs.y-this.paper.zoomOffset()[1])/this.paper.zoomScale()[1]);
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

>>>>>>> 9cddd4fa593d585b124017285716579a16f20adc
