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
~varibles: list of variables on current level
~shape: Raphael shape
*/
Level.prototype = Object.create(Node.prototype);

function Level(parent,x,y) {
	//level is 0 if no parent, is main plane
	var level_init = (!parent)?0:parent.level+1;
	Object.getPrototypeOf(Level.prototype).constructor.call(this,parent,level_init);
	
	//members
	this.children = new List();
	this.variables = new List();
	this.shape;
	
	this.DEFAULT_CHILD_WIDTH = 50;
	this.DEFAULT_CHILD_HEIGHT = 50;
	
	//plane constructor
	if(!parent) {
		this.shape = R.rect(0,0,2000,2000);
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
		var new_width = (x+w < cx+cw+sc) ? cx+cw+sc-x: w;
		//child is out of bounds on bottom
		var new_height = (y+h < cy+ch+sc) ? cy+ch+sc-y: h;
		
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
children like a hull;
*/
Level.prototype.contract = function() {
	//D(this);
	if(this.parent) {
		var sc = 20; //slack
		//intial hull around first child with slack
		var itr = this.children.begin();
		//child properties
		var cx = itr.val.shape.attrs.x; var cy = itr.val.shape.attrs.y; 
		var cw = itr.val.shape.attrs.width; var ch = itr.val.shape.attrs.height;
		//contracted properties
		var new_x = cx-sc; var new_y = cy-sc;
		var new_width = cw+sc+sc; 
		var new_height = ch+sc+sc;
		itr = itr.next; //move to next child
		//loop over children updating contracting hull
		while(itr!=this.children.end()) {
			cx = itr.val.shape.attrs.x; cy = itr.val.shape.attrs.y; 
			cw = itr.val.shape.attrs.width; ch = itr.val.shape.attrs.height;
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
	var itr = this.children.begin();
	while(itr!=this.children.end()) {
		itr.val.dragMove(dx,dy);
		itr = itr.next;
	}
	this.parent.expand(new_x,new_y,this.shape.attrs.width,this.shape.attrs.height);
	this.parent.contract();
};

Level.prototype.onDragMove = function(dx, dy) {
	this.parent.dragMove(dx,dy);
};

Level.prototype.dragStart = function() {
	var itr = this.children.begin();
	while(itr!=this.children.end()) {
		itr.val.dragStart();
		itr = itr.next;
	}
	this.ox = this.shape.attr("x");
	this.oy = this.shape.attr("y");
};

Level.prototype.onDragStart = function() {
	this.parent.dragStart();
	this.animate({"fill-opacity": .2}, 500);
	//this.scale(3,3);
};

Level.prototype.dragEnd = function() {
	this.parent.contract();
}

Level.prototype.onDragEnd = function() {
	this.parent.dragEnd();
	this.animate({"fill-opacity": 0}, 500);
	//this.scale(1/3,1/3);
};

Level.prototype.onDoubleClick = function(event) {
	//D(event);
	this.parent.addChild(event.x,event.y);
};

////////////////////////////////////////////////////////////////////////