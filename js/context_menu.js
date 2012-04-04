function ContextHandler() {
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
	mclose();
	this.context = new Context(node,x,y);
}

ContextHandler.prototype.CloseContext = function() {
	if(this.context) {
		this.context.close();
		delete this.context;
	}
}

////////////////////////////////////////////////////////////////////////

function Context(node,x,y) {
	this.node = node || null;
	this.level = node.level;
	this.x = x; this.y = y;
	
	this.menu_items = R.set();
	this.items = {}
	this.num_items = 0;
	
	this.setup()
	this.show();
};

Context.prototype.addItem = function(name,func) {
	this.items[name] = func;
	this.num_items++;
}

Context.prototype.setup = function() {
	this.addItem('insertion:cut',TheProof.insertion_cut);
	this.addItem('insertion:variable',TheProof.insertion_variable);
	this.addItem('empty double cut',TheProof.empty_double_cut);
}

Context.prototype.show = function() {
	var n = this.num_items; //shorthand variable
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
	var oy = (this.y+offset+partition*n+tol > window.innerHeight-R.canvas.offsetTop) ? this.y-(partition*n+tol)+offset : this.y+offset;	
	
	var c=0; //item counter
	for(x in this.items) {
		var menu_item = R.set() //menu button set
		var y = oy+partition*c; //start y at correct distance
		//construct menu box
		menu_item.push( 
			R.rect(zoomOffset()[0]+ox*zoomScale()[0],
							zoomOffset()[1]+y*zoomScale()[1],
							width*zoomScale()[0],
							partition*zoomScale()[1])
			.attr({stroke:"#000",fill: "#aabbcc", "stroke-width": 1, "text":"asdf"})
		);
		//construct menu text
		menu_item.push(
			R.text(zoomOffset()[0]+(ox+ox+width)/2*zoomScale()[0], 
							zoomOffset()[1]+(y+y+partition)/2*zoomScale()[1], 
							x)
			.attr({"font-size":font_size*zoomScale()[0]})
		);
		
		//set up menu button click function
		menu_item.click( 
			//closure that creates function that executes button function at mouse event
			//then closes menu
			(function(f,n,x,y,c) {
				return function() { f.call(TheProof,n,x,y); c(); }
			})(this.items[x],this.node,this.x*zoomScale()[0],this.y*zoomScale()[1],Context.prototype.makeClose(this))
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