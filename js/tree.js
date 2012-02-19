function Node(parent,level) {
	this.parent = parent || null;
	this.level = level;
};

Node.prototype.up = function() { return this.parent };

////////////////////////////////////////////////////////////////////////

Level.prototype = Object.create(Node.prototype);

function Level(parent,x,y) {
	var level_init = (!parent)?0:parent.level+1;
	Object.getPrototypeOf(Level.prototype).constructor.call(this,parent,level_init);
	
	this.children = [];
	this.variables = [];
	this.shape;
	
	this.DEFAULT_CHILD_WIDTH = 50;
	this.DEFAULT_CHILD_HEIGHT = 50;
	
	if(!parent) {
	
		this.shape = R.rect(0,0,2000,2000);
		/*this.shape.mouseover(function () {
			this.animate({"fill-opacity": .2}, 500); });
		this.shape.mouseout(function () {
			this.animate({"fill-opacity": .1}, 500); });*/
		var color = '#888';
		this.shape.attr(
			{fill: color, 
			stroke: color, "fill-opacity": .1});
			
	} else {
		
		this.shape = R.rect(x,y,this.DEFAULT_CHILD_WIDTH,this.DEFAULT_CHILD_HEIGHT,20);
		this.shape.mouseover(function () {
			this.animate({"fill-opacity": .2}, 500); });
		this.shape.mouseout(function () {
			this.animate({"fill-opacity": .0}, 500); });
	
		var color = Raphael.getColor();
		this.shape.attr(
			{fill: color, 
			stroke: color, "fill-opacity": 0,});
		this.shape.drag(this.onDragMove,this.onDragStart,this.onDragEnd);
		
	}
	this.shape.parent = this
	
	this.shape.dblclick(this.onDoubleClick);
};

Level.prototype.expand = function() {
		D(this);
	if(this.parent) {
		this.shape.transform("s1.5");
		this.parent.expand();
	}
}

Level.prototype.addChild = function(x,y) {
	var child = new Level(this,x-this.DEFAULT_CHILD_WIDTH/2,y-this.DEFAULT_CHILD_HEIGHT/2);
	//D(this);
	this.children.push(child);
	this.expand();
};

Level.prototype.onDragMove = function(dx, dy) {
	var att = {x: this.ox + dx, y: this.oy + dy};
	this.attr(att);
};

Level.prototype.onDragStart = function() {
	this.ox = this.attr("x");
	this.oy = this.attr("y");
	this.animate({"fill-opacity": .2}, 500);
	//this.scale(3,3);
};

Level.prototype.onDragEnd = function() {
	this.animate({"fill-opacity": 0}, 500);
	//this.scale(1/3,1/3);
};

Level.prototype.onDoubleClick = function(event) {
	//D(event);
	this.parent.addChild(event.x,event.y);
};

////////////////////////////////////////////////////////////////////////