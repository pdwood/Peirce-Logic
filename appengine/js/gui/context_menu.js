function ContextHandler(R) {
	this.paper = R;
	this.selectedNodes = new List();
	this.prev_x = undefined;
	this.prev_y = undefined;
	Mousetrap.bind('ctrl', this.StartMultiActive(), 'keydown');
	this.context = undefined;
	$(document).click(
		(function(ch) {
			return function() {ch.CloseContext();};
		})(this)
	);
}

ContextHandler.prototype.NewContext = function(node,x,y) {
	if(this.context) {
		this.context.close();
		delete this.context;
	}
	var nodes = new List();
	nodes.push_back(node);
	this.context = new Context(this.paper,nodes,x,y);
};

ContextHandler.prototype.NewContextMulti = function(nodeList,x,y) {
	if(this.context) {
		this.context.close();
		delete this.context;
	}
	this.context = new Context(this.paper,nodeList,x,y);
};

ContextHandler.prototype.CloseContext = function() {
	if(this.context) {
		this.context.close();
		delete this.context;
	}
};

ContextHandler.prototype.StartMultiActive = function () {
	return function(ch) { return function () {
		if(!ch.multiactive) {
			ch.multiactive = true;
			Mousetrap.reset();
			D('start multi');
			Mousetrap.bind('ctrl', ch.EndMultiActive(), 'keyup');
		}
	};
	}(this);
};

ContextHandler.prototype.EndMultiActive = function () {
	return function(ch) { return function () {
		if(ch.multiactive) {
			D('end multi');
			ch.multiactive = false;
			ch.selectedNodes.iterate( function (node) {
				node.setClickActive(false);
			});
			Mousetrap.bind('ctrl', ch.StartMultiActive(), 'keydown');
			if(ch.selectedNodes.length)
				ch.NewContextMulti(ch.selectedNodes,ch.prev_x,ch.prev_y);
			ch.selectedNodes = new List();
		}
	};
	}(this);
};


ContextHandler.prototype.SingleClickHandler = function(node,event) {
	if (this.multiactive) {
		var coords = mouse_to_svg_coordinates(this.paper,event);
		this.prev_x = coords.x;
		this.prev_y = coords.y;
		this.changeSelection(node);
	}
};


ContextHandler.prototype.changeSelection = function(node) {
	// Can't select the top level
	if(node.parent === null) return;
	if(this.selectedNodes.contains(node)) {
		node.setClickActive(false);
	}
	else {
		node.setClickActive(true);
	}

	// Remove or add node
	var listItr = this.selectedNodes.contains(node);
	if(!listItr)
		this.selectedNodes.push_back(node);
	else this.selectedNodes.erase(listItr);
};

////////////////////////////////////////////////////////////////////////

function Context(R,nodes,x,y) {
	this.paper = R;
	this.nodes = nodes || null;
	this.x = x; this.y = y;

	this.menu_items = this.paper.set();
	this.items = {};
	this.num_items = 0;

	this.inf = new InferenceRule(TheProof.thunk);

	this.setup();
	this.show();
}

Context.prototype.addItem = function(name,func) {
	this.items[name] = func;
	this.num_items++;
};

Context.prototype.setup = function() {
	var available_items = this.inf.AvailableRules(TheProof,this.nodes);
	for(var k in available_items) {
		this.addItem(k,available_items[k]);
	}
};

Context.prototype.show = function() {
	var n = this.num_items; //shorthand variable
	if (n===0) return; //return for no items
	//get longest menu item name length
	var max_length = 0;
	for(var x in this.items) {
		max_length = Math.max(max_length,x.length);
	}

	//set default menu properties
	var font_size = 10;
	//var text_prop = {font: ""+font_size+"px Helvetica, Arial", fill: "#fff"}
	var partition = font_size+8; //height of item box
	var width = font_size*max_length; //width of item box
	var tol = 5, offset = 3; //tolerance of window bounds; offset from mouse

	//set correct initial x and y values
	//fit overflow from width
	var ox = (this.x+offset+width+tol > this.paper._viewBox[2]) ? this.x-(width+tol)+offset : this.x+offset;
	//fit overflow from height
	var oy = (this.y+offset+partition*n+tol > this.paper._viewBox[3]-this.paper.canvas.offsetTop) ? this.y-(partition*n+tol)+offset : this.y+offset;

	var c=0; //item counter
	for(x in this.items) {
		var menu_item = this.paper.set(); //menu button set
		var y = oy+partition*c; //start y at correct distance
		//construct menu box
		menu_item.push(
			this.paper.rect(ox, y, width, partition)
			.attr({stroke:"#000",fill: "#aabbcc", "stroke-width": 1, "text":"asdf"})
		);
		//construct menu text
		menu_item.push(
			this.paper.text((ox+ox+width)/2,
							(y+y+partition)/2,
							x)
			.attr({"font-size":font_size})
		);

		//set up menu button click function
		menu_item.click(
			//closure that creates function that executes button function at mouse event
			//then closes menu
			(function(f,n,x,y,c) {
				return function() { f.call(self.inf, TheProof, n, x, y);
									c(); };
			})(this.items[x],this.nodes,this.x,this.y,Context.prototype.makeClose(this))
		);

		this.menu_items.push(menu_item); //push button into menu_items set
		c++;
	}
};

Context.prototype.close = function() {
	this.menu_items.remove();
	this.menu_items.clear();
};

Context.prototype.makeClose = function (menu) {
	return function(){menu.close();};
};
