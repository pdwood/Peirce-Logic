/*
Level: Plane/Cut, inherits from Node
~children: list of child cuts/levels
~variables: list of variables on current level
~shape: Raphael shape
*/
Level.prototype = Object.create(Node.prototype);

function Level(R,parent,x,y,duplicate) {
	Object.getPrototypeOf(Level.prototype).constructor.call(this,parent);

	this.paper = R;

	this.shape = null;

	this.DEFAULT_PLANE_WIDTH = this.paper.width*6;
	this.paper.DEFAULT_PLANE_WIDTH = this.DEFAULT_PLANE_WIDTH;
	this.DEFAULT_PLANE_HEIGHT = this.paper.height*6;
	this.paper.DEFAULT_PLANE_HEIGHT = this.DEFAULT_PLANE_HEIGHT;
	this.DEFAULT_CHILD_WIDTH = 50;
	this.DEFAULT_CHILD_HEIGHT = 50;
	this.DEFAULT_CURVATURE = 20;

	//setup shape if not in duplication process
	if(!duplicate) {
		//plane constructor
		if(!parent) {
			this.shape = this.paper.rect(0,0,this.DEFAULT_PLANE_WIDTH,this.DEFAULT_PLANE_HEIGHT);
			/*this.shape.mouseover(function () {
				this.animate({"fill-opacity": .2}, 500); });
			this.shape.mouseout(function () {
				this.animate({"fill-opacity": .1}, 500); });*/
			var color = '#888';
			this.shape.attr({
				fill: color,
				stroke: color, "fill-opacity": 0.1
			});
		}
		//cut constructor
		else {
			this.shape = this.paper.rect(x,y,this.DEFAULT_CHILD_WIDTH,this.DEFAULT_CHILD_HEIGHT,this.DEFAULT_CURVATURE);
			//mouseover effects
				this.shape.mouseover(function () {
					this.attr({"fill-opacity": 0.2}); });
				this.shape.mouseout(function () {
					this.attr({"fill-opacity": 0.0}); });

			//color spectrum based on level
			var color = 0; Raphael.getColor.reset();
			for(var x =1; x<=this.getLevel()+1;x++){
				color = Raphael.getColor();
			}
			this.shape.attr(
				{fill: color,
				stroke: color, "fill-opacity": 0});
			this.shape.drag(this.onDragMove,this.onDragStart,this.onDragEnd);
		}

		//shape has parent pointer back to level
		//allows for referencing in Raphael callbacks
		this.shape.parent = this;
		this.shape.click(function(e) {ContextMenu.SingleClickHandler(this.parent,e);});
		this.shape.dblclick(this.onDoubleClick);
	}
}

/*
Level.duplicate

Level deep copy.
Copies entire tree.
*/
Level.prototype.duplicate = function() {
	var dup = new Level(this.paper,null,0,0,true);
	dup.saved_attr = jQuery.extend(true, {}, this.shape.attrs);

	this.subtrees.iterate(function(x){
		child_dup = x.duplicate();
		child_dup.parent = dup;
		dup.subtrees.push_back(child_dup);
	});
	this.leaves.iterate(function(x){
		variable_dup = x.duplicate();
		variable_dup.parent = dup;
		dup.leaves.push_back(variable_dup);
	});
	return dup;
};


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
};


/*
Level.compressTree()

Store rapahel objects from
entire sub-tree from this
as the root; Used for later
use
*/
Level.prototype.compressTree = function() {
	//compress children first
	this.leaves.iterate(function(x){ x.compress(); });
	this.subtrees.iterate(function(x){ x.compressTree(); });
	this.compress();
};


/*
Level.restore

Re-render shape from
saved shape attributes
*/
Level.prototype.restore = function() {
	if(this.saved_attr) { //check if saved attributes exist
		this.renderShape(this.saved_attr);
	}
};


/*
Level.restoreTree()

Re-render rapahel objects from
entire sub-tree from this
as the root
*/
Level.prototype.restoreTree = function() {
	//show current level first
	this.restore();
	this.leaves.iterate(function(x){ x.restore(); });
	this.subtrees.iterate(function(x){ x.restoreTree(); });
};


/*
Level.hide

Hide rapahel objects from
entire sub-tree from this
as the root
*/
Level.prototype.hide = function() {
	//show children
	this.leaves.iterate(function(x){ x.hide(); });
	this.subtrees.iterate(function(x){ x.hide(); });
	this.shape.hide();
};


/*
Level.show

Show rapahel objects from
entire sub-tree from this
as the root
*/
Level.prototype.show = function() {
	//show current level first
	this.shape.show();
	//show children
	this.leaves.iterate(function(x){ x.show(); });
	this.subtrees.iterate(function(x){ x.show(); });
};


/*
Level.addChild
~x: new child x
~y: new child y

Creates new child inside
current level at x,y position (x,y is center)
returns child
*/
Level.prototype.addChild = function(x,y) {
	var child = new Level(this.paper,this,x-this.DEFAULT_CHILD_WIDTH/2,y-this.DEFAULT_CHILD_HEIGHT/2);
	child.shape.toFront();
	this.subtrees.push_back(child);
	//move collided nodes out of way
	this.shiftAdjacent(child,child.shape.getBBox());
	//expand self to new child
	this.expand(child.shape.attrs.x, child.shape.attrs.y, child.shape.attrs.width, child.shape.attrs.height,true);
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
	var variable = new Variable(this.paper,this,x,y);
	variable.text.toFront();
	//this creates variable, but not adds it
	//first variable's text box pops up
	//if valid text used to initialize variable
	//then variable pushes itself into this level
};

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

Level.prototype.onSingleClick = function(e) {
	//this.shape.mouseout(function () {
	//	this.attr({"fill-opacity": .0}); });
	if(event.ctrlKey) {
		this.toggleClickActive();
		ContextMenu.changeSelection(this.parent);
	}
};

Level.prototype.setClickActive = function(flag) {
	if(!flag)
		this.shape.attr({"stroke-width": 1});
	else
		this.shape.attr({"stroke-width": 3});
};




/*
Level.onDoubleClick
~event: mouse event

Object level handler for
mouse double click action;
Creates context menu on node;
*/
Level.prototype.onDoubleClick = function(event) {
	if (!event.ctrlKey) {
		//Menu intialized with node,node's level, and mouse x/y
		ContextMenu.NewContext(this.parent,event.offsetX,event.offsetY);
	}
};
