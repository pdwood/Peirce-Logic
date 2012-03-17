/*
Node: tree node
~parent: parent pointer
~level: node depth in tree
*/
function Node(parent,level) {
	this.parent = parent || null;
	this.level = level;
};

////////////////////////////////////////////////////////////////////////

/*
Level: Plane/Cut, inherits from Node
~children: list of child cuts/levels
~variables: list of variables on current level
~shape: Raphael shape
*/
Level.prototype = Object.create(Node.prototype);

function Level(parent,x,y,duplicate) {
	//level is 0 if no parent, is main plane
	var level_init = (!parent)?0:parent.level+1;
	Object.getPrototypeOf(Level.prototype).constructor.call(this,parent,level_init);
	
	//members
	this.children = new List();
	this.variables = new List();
	this.shape = null;
	
	this.DEFAULT_PLANE_WIDTH = 2000;
	this.DEFAULT_PLANE_HEIGHT = 2000;
	this.DEFAULT_CHILD_WIDTH = 50;
	this.DEFAULT_CHILD_HEIGHT = 50;
	
	//setup shape if not in duplication process
	if(!duplicate) {
		//plane constructor
		if(!parent) {
			this.shape = R.rect(0,0,this.DEFAULT_PLANE_WIDTH,this.DEFAULT_PLANE_HEIGHT);
			/*this.shape.mouseover(function () {
				this.animate({"fill-opacity": .2}, 500); });
			this.shape.mouseout(function () {
				this.animate({"fill-opacity": .1}, 500); });*/
			var color = '#888';
			this.shape.attr({
				fill: color, 
				stroke: color, "fill-opacity": .1
			});
				
		} 
		//cut constructor
		else {
			this.shape = R.rect(x,y,this.DEFAULT_CHILD_WIDTH,this.DEFAULT_CHILD_HEIGHT,20);
			//mouseover effects
			this.shape.mouseover(function () {
				this.animate({"fill-opacity": .2}, 500); });
			this.shape.mouseout(function () {
				this.animate({"fill-opacity": .0}, 500); });
			
			//need to eventually make colors consistent
			var color = Raphael.getColor();
			this.shape.attr(
				{fill: color, 
				stroke: color, "fill-opacity": 0,});
			this.shape.drag(this.onDragMove,this.onDragStart,this.onDragEnd);
		}
		
		//shape has parent pointer back to level
		//allows for referencing in Raphael callbacks
		this.shape.parent = this;
		
		this.shape.dblclick(this.onDoubleClick);
	}
};

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
		this.shape = R.rect(0,0,this.DEFAULT_PLANE_WIDTH,this.DEFAULT_PLANE_HEIGHT).attr(attr);
		/*this.shape.mouseover(function () {
			this.animate({"fill-opacity": .2}, 500); });
		this.shape.mouseout(function () {
			this.animate({"fill-opacity": .1}, 500); });*/
	} 
	//for cut
	else {
		this.shape = R.rect(0,0,this.DEFAULT_CHILD_WIDTH,this.DEFAULT_CHILD_HEIGHT,20).attr(attr);
		//mouseover effects
		this.shape.mouseover(function () {
			this.animate({"fill-opacity": .2}, 500); });
		this.shape.mouseout(function () {
			this.animate({"fill-opacity": .0}, 500); });
		
		this.shape.drag(this.onDragMove,this.onDragStart,this.onDragEnd);
	}
	
	//shape has parent pointer back to level
	//allows for referencing in Raphael callbacks
	this.shape.parent = this;
	
	this.shape.dblclick(this.onDoubleClick);
}

/*
Level.compress

Save shape attributes
and remove shape from 
level and screen; 
Used in saving a tree 
for later use
*/
Level.prototype.compress = function() {
	this.saved_attr = jQuery.extend(true, {}, this.shape.attrs);
	this.shape.remove();
	this.shape = null;
}

/*
Level.compressTree()

Store rapahel objects from
entire sub-tree from this 
as the root; Used for later
use
*/
Level.prototype.compressTree = function() {
	//compress children first
	var itr=this.children.begin(); 
	while(itr!=this.children.end()) {
		itr.val.compressTree();
		itr = itr.next;
	}
	this.compress();
	itr=this.variables.begin();
	while(itr!=this.variables.end()) {
		itr.val.compress();
		itr = itr.next;
	}
}

/*
Level.restore

Re-render shape from 
saved shape attributes
*/
Level.prototype.restore = function() {
	if(this.saved_attr) { //check if saved attributes exist
		this.renderShape(this.saved_attr)
	}
}

/*
Level.restoreTree()

Re-render rapahel objects from
entire sub-tree from this 
as the root
*/
Level.prototype.restoreTree = function() {
	//show current level first
	this.restore();
	var itr=this.variables.begin();
	while(itr!=this.variables.end()) {
		itr.val.restore();
		itr = itr.next;
	}
	itr=this.children.begin(); 
	while(itr!=this.children.end()) {
		itr.val.restoreTree();
		itr = itr.next;
	}
}

/*
Level.hide

Hide rapahel objects from
entire sub-tree from this 
as the root
*/
Level.prototype.hide = function() {
	//hide children first
	var itr=this.children.begin(); 
	while(itr!=this.children.end()) {
		itr.val.hide();
		itr = itr.next;
	}
	this.shape.hide();
	itr=this.variables.begin();
	while(itr!=this.variables.end()) {
		itr.val.text.hide();
		itr = itr.next;
	}
}

/*
Level.show

Show rapahel objects from
entire sub-tree from this 
as the root
*/
Level.prototype.show = function() {
	//show current level first
	this.shape.show();
	var itr=this.variables.begin();
	while(itr!=this.variables.end()) {
		itr.val.text.show();
		itr = itr.next;
	}
	itr=this.children.begin(); 
	while(itr!=this.children.end()) {
		itr.val.show();
		itr = itr.next;
	}
}

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
Level.prototype.expand = function(cx,cy,cw,ch) {
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
		//this.shape.animate(expanded_att,200,">");
		this.shape.attr(expanded_att);
		//expand parent
		this.parent.expand(new_x,new_y,new_width,new_height);
	}
}

/*
Level.contract

Takes level's shape and
contracts its around all
children and variables like a hull;
*/
Level.prototype.contract = function() {
	//D(this);
	if(this.parent) {
		var sc = 20; //slack
		//state variables
		var new_x = (this.shape.attrs.x+this.shape.attrs.width)/2;
		var new_y = (this.shape.attrs.y+this.shape.attrs.height)/2;
		var new_width = 0, new_height = 0;
		var initial_hull_set_flag = false; //flag for hull initilization
		
		if(this.children.length) { //if children
			//intial hull around first child with slack
			var itr = this.children.begin();
			var cx = itr.val.shape.attrs.x; var cy = itr.val.shape.attrs.y;
			var cw = itr.val.shape.attrs.width; var ch = itr.val.shape.attrs.height;
			//contracted properties
			new_x = cx-sc; var new_y = cy-sc;
			new_width = cw+sc+sc;
			new_height = ch+sc+sc;
			initial_hull_set_flag = true;
			itr = itr.next; //move to next child
			while(itr!=this.children.end()) {
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
		
		if(this.variables.length) { //if variables
			var itr = this.variables.begin();
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
			while(itr!=this.variables.end()) {
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
		//update shape
		var expanded_att = {
			x: new_x,
			y: new_y,
			width: new_width,
			height: new_height};
		//this.shape.animate(expanded_att,200,"<");
		this.shape.attr(expanded_att);
		
		//contract parent
		this.parent.contract();
	}
}

/*
Level.addChild
~x: new child x
~y: new child y

Creates new child inside
current level at x,y position (x,y is center)
returns child
*/
Level.prototype.addChild = function(x,y) {
	var child = new Level(this,x-this.DEFAULT_CHILD_WIDTH/2,y-this.DEFAULT_CHILD_HEIGHT/2);
	this.children.push_back(child);
	//expand self to new child
	this.expand(child.shape.attrs.x, child.shape.attrs.y, child.shape.attrs.width, child.shape.attrs.height);
	return child;
};

/*
Level.addChild
~x: new variable x
~y: new variable y

Creates new variable inside
current level at x,y position
*/
Level.prototype.addVariable = function(x,y) {
	var variable = new Variable(this,x,y);
	//this creates variable, but not adds it
	//first variable's text box pops up
	//if valid text used to initialize variable
	//then variable pushes itself into this level
};

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
	var itr = this.children.begin();
	while(itr!=this.children.end()) {
		itr.val.dragStart();
		itr = itr.next;
	}
	//save orignal positions of variables
	var itr = this.variables.begin();
	while(itr!=this.variables.end()) {
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
	this.animate({"fill-opacity": .2}, 500);
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
	//shift shape
	var new_x = this.ox + dx;
	var new_y = this.oy + dy;
	this.shape.attr({x: new_x, y: new_y});
	//shift children
	var itr = this.children.begin();
	while(itr!=this.children.end()) {
		itr.val.dragMove(dx,dy);
		itr = itr.next;
	}
	//shift variables
	var itr = this.variables.begin();
	while(itr!=this.variables.end()) {
		itr.val.dragMove(dx,dy);
		itr = itr.next;
	}
	//fit hull to new area
	this.parent.expand(new_x,new_y,this.shape.attrs.width,this.shape.attrs.height);
	this.parent.contract();
};

//Level callback for dragging
Level.prototype.onDragMove = function(dx, dy) {
	this.parent.dragMove(dx,dy);
};

/*
Level.dragEnd

Object level handler for 
drag end event action; 
Does final contraction of level
*/
Level.prototype.dragEnd = function() {
	this.parent.contract();
}

//Level callback for drag ending
Level.prototype.onDragEnd = function() {
	this.parent.dragEnd();
	this.animate({"fill-opacity": 0}, 500);
};

/*
Level.onDoubleClick
~event: mouse event

Object level handler for 
mouse double click action; 
Creates context menu on node;
*/
Level.prototype.onDoubleClick = function(event) {
	//Menu intialized with node,node's level, and mouse x/y
	ContextMenu.NewContext(this.parent,event.offsetX,event.offsetY);
};

//Duplicates the entire tree.
Level.prototype.duplicate = function() {
	var dup = new Level(null,0,0,true);
	dup.saved_attr = jQuery.extend(true, {}, this.shape.attrs);
	var itr = this.children.begin();
	while(itr != this.children.end()) {
		child_dup = itr.val.duplicate();
		child_dup.parent = dup;
		dup.children.push_back(child_dup);
		itr = itr.next;
	}
	itr = this.variables.begin();
	while(itr != this.variables.end()) {
		variable_dup = itr.val.duplicate();
		variable_dup.parent = dup;
		dup.variables.push_back(variable_dup);
		itr = itr.next;
	}
	return dup;
};

////////////////////////////////////////////////////////////////////////

/*
Variable: Propostional variable, inherits from Node
~text: Raphael text
*/
Variable.prototype = Object.create(Node.prototype);

function Variable(parent,x,y,duplicate) {
	//level is 0 if no parent, is main plane
	var level_init = (!parent)?0:parent.level;
	//variable level is parent level
	Object.getPrototypeOf(Variable.prototype).constructor.call(this,parent,level_init);
	
	if(!duplicate) {
		//initial text, can't be empty or else it defaults to 0,0 origin
		this.text = R.text(x,y,"~"); 
		text = this.text;
		this.text.parent = this;
		
		//setup text initialization
		var w=100,h=16; //dimensions of text box
		//create div with inner text box
		var text_box = $('<div> <input style="height:' + h + 'px; width: ' + w + 'px;" type="text" name="textbox" value=""></div>');
		//center over text area
		text_box.css({"z-index" : 2, "position" : "absolute"});
		text_box.css("left",this.text.getBBox().x-w/2+8);
		text_box.css("top",this.text.getBBox().y+19);
		//text creation function
		var text_evaluate = function() {
			//get rid extraneous pre/post white space
			var text_string = this.children[0].value.replace(/^\s+|\s+$/g,"");
			this.parentNode.removeChild(this); //remove div
			if(text_string.length) { //if valid string, not just white space
				//initialize and add variable to parent
				text.attr({'text':text_string});
				text.parent.parent.variables.push_back(text.parent);
				text.parent.parent.expand(text.getBBox().x, text.getBBox().y, text.getBBox().width, text.getBBox().height);
			}
			else { //else remove text and don't add to parent
				text.remove();
			}
		}
		text_box.focusout( text_evaluate ); //evaluate text on focus out of text box
		//need to enter based evaluation
		$("body").append(text_box); //insert text box into page
		$(text_box).children()[0].focus(); //focus on text box
		
		this.text.drag(this.onDragMove,this.onDragStart,this.onDragEnd);
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
	
	this.text = R.text(0,0,"~").attr(attr);
	this.text.parent = this;
	
	this.text.drag(this.onDragMove,this.onDragStart,this.onDragEnd);
}

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
};
//Variable callback for dragging
Variable.prototype.onDragMove = function(dx, dy) {
	this.parent.dragMove(dx,dy);
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

Variable.prototype.duplicate = function() {
	var dup = new Variable(null,0,0,true);
	dup.saved_attr = jQuery.extend(true, {}, this.text.attrs);
	return dup;
};
