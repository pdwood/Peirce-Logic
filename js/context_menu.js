var selectedNodes = new List();

changeSelection = function(node) {
	// Can't select the top level
	if(node.getLevel() == 0) return;

	// Get the location of the node in the list (if it exists)
	var listItr = selectedNodes.begin();
	while(listItr != null)
		if(listItr.val === node) break;
		else listItr = listItr.next;

	// Remove or add the node
	if(listItr == null) selectedNodes.push_back(node);
	else selectedNodes.erase(listItr);
}



function ContextHandler(R) {
	this.paper = R;

	this.context = undefined;
	$(document).click(
		(function(ch) {
			return function() {ch.CloseContext();}
		})(this)
	);
}

ContextHandler.prototype.NewContext = function(node,x,y) {
	if(this.context) {
		this.context.close();
		delete this.context;
	}
	this.context = new Context(this.paper,node,x,y);
}

ContextHandler.prototype.CloseContext = function() {
	if(this.context) {
		this.context.close();
		delete this.context;
	}
}

////////////////////////////////////////////////////////////////////////

function Context(R,node,x,y) {
	this.paper = R;
	this.node = node || null;
	this.level = node.getLevel();
	this.x = x; this.y = y;
	
	this.menu_items = this.paper.set();
	this.items = {};
	this.num_items = 0;
	
	this.setup();
	this.show();
};

Context.prototype.addItem = function(name,func) {
	this.items[name] = func;
	this.num_items++;
}

Context.prototype.setup = function() {
	if(this.paper.CURRENT_MODE == this.paper.LogicMode.PREMISE_MODE) {
		if(this.node instanceof Level) {
			this.addItem('premise insertion:cut',TheProof.premise_insertion_cut);
			this.addItem('premise insertion:variable',TheProof.premise_insertion_variable);
			this.addItem('double cut:empty',TheProof.empty_double_cut);
			if(this.node.parent) {
				this.addItem('double cut:cut',TheProof.double_cut);
				this.addItem('double cut:reverse',TheProof.r_double_cut);
				if(this.node.getLevel() % 2)
					this.addItem('erasure',TheProof.erasure);
				else
					this.addItem('insertion',TheProof.insertion);

			}
		}
		else if(this.node instanceof Variable) {
			//this.addItem('deletion',TheProof.deletetion);
			this.addItem('double cut:cut',TheProof.double_cut);
			this.addItem('double cut:reverse',TheProof.r_double_cut);
			if(this.node.getLevel() % 2)
				this.addItem('erasure',TheProof.erasure);
			else
				this.addItem('insertion',TheProof.insertion);
		}
	}
	if(this.paper.CURRENT_MODE == this.paper.LogicMode.PROOF_MODE) {
		if(this.node instanceof Level) {
			if(this.node.getLevel() % 2) { //odd level
			
			}
			else {
			
			}
		}
		else if(this.node instanceof Variable) {
			if(this.node.getLevel() % 2) { //odd level
			
			}
			else {
			
			}
		}
	}
}

Context.prototype.show = function() {
	var n = this.num_items; //shorthand variable
	if(n==0) return; //return for no items
	//get longest menu item name length
	var max_length = 0;
	for(x in this.items) {
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
	var ox = (this.x+offset+width+tol > window.innerWidth)? this.x-(width+tol)+offset : this.x+offset; 
	//fit overflow from height
	var oy = (this.y+offset+partition*n+tol > window.innerHeight-this.paper.canvas.offsetTop) ? this.y-(partition*n+tol)+offset : this.y+offset;	
	
	var c=0; //item counter
	for(x in this.items) {
		var menu_item = this.paper.set() //menu button set
		var y = oy+partition*c; //start y at correct distance
		//construct menu box
		menu_item.push( 
			this.paper.rect(this.paper.zoomOffset()[0]+ox*this.paper.zoomScale()[0],
							this.paper.zoomOffset()[1]+y*this.paper.zoomScale()[1],
							width*this.paper.zoomScale()[0],
							partition*this.paper.zoomScale()[1])
			.attr({stroke:"#000",fill: "#aabbcc", "stroke-width": 1, "text":"asdf"})
		);
		//construct menu text
		menu_item.push(
			this.paper.text(this.paper.zoomOffset()[0]+(ox+ox+width)/2*this.paper.zoomScale()[0], 
							this.paper.zoomOffset()[1]+(y+y+partition)/2*this.paper.zoomScale()[1], 
							x)
			.attr({"font-size":font_size*this.paper.zoomScale()[0]})
		);
		
		//set up menu button click function
		menu_item.click( 
			//closure that creates function that executes button function at mouse event
			//then closes menu
			(function(f,n,x,y,c) {
				return function() { f.call(TheProof,n,x+this.paper.zoomOffset()[0],y+this.paper.zoomOffset()[1]); c(); }
			})(this.items[x],this.node,this.x*this.paper.zoomScale()[0],this.y*this.paper.zoomScale()[1],Context.prototype.makeClose(this))
		);
		
		this.menu_items.push(menu_item); //push button into menu_items set
		c++;
	}
};

Context.prototype.close = function() {
	this.menu_items.remove();
	this.menu_items.clear();
}

Context.prototype.makeClose = function (menu) {
	return function(){menu.close()}
}