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
	
	this.children = new List();
	this.variables = new List();
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

Level.prototype.expand = function(cx,cy,cw,ch) {
	//D(this);
	if(this.parent) {
		var sc = 20;
		var x = this.shape.attrs.x; var y = this.shape.attrs.y;
		var w = this.shape.attrs.width; var h = this.shape.attrs.height;
		var new_x = x; var new_y = y;
		if(x > cx-sc) {
			new_x = cx-sc;
			w += x-new_x;
		}
		if(y > cy-sc) {
			new_y = cy-sc;
			h += y-new_y;
		}
		var new_width = (x+w < cx+cw+sc) ? cx+cw+sc-x: w;
		var new_height = (y+h < cy+ch+sc) ? cy+ch+sc-y: h;
		var expanded_att = {
			x: new_x,
			y: new_y,
			width: new_width,
			height: new_height};
		this.shape.animate(expanded_att,200,">");
		this.parent.expand(new_x,new_y,new_width,new_height);
	}
}

Level.prototype.addChild = function(x,y) {
	var child = new Level(this,x-this.DEFAULT_CHILD_WIDTH/2,y-this.DEFAULT_CHILD_HEIGHT/2);
	//D(this);
	this.children.push_back(child);
	this.expand(child.shape.attrs.x, child.shape.attrs.y, child.shape.attrs.width, child.shape.attrs.height);
};

Level.prototype.dragMove = function(dx, dy) {
	var new_x = this.ox + dx;
	var new_y = this.oy + dy;
	this.shape.attr({x: new_x, y: new_y});
	this.parent.expand(new_x,new_y,this.shape.attrs.width,this.shape.attrs.height);
	var itr = this.children.begin();
	while(itr!=this.children.end()) {
		itr.val.dragMove(dx,dy);
		itr = itr.next;
	}
};

Level.prototype.onDragMove = function(dx, dy) {
	this.parent.dragMove(dx,dy);
};

Level.prototype.dragStart = function() {
	this.ox = this.shape.attr("x");
	this.oy = this.shape.attr("y");
	var itr = this.children.begin();
	while(itr!=this.children.end()) {
		itr.val.dragStart();
		itr = itr.next;
	}
};

Level.prototype.onDragStart = function() {
	this.parent.dragStart();
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