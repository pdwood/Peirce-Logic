function test1() {
	alert("foo");
}

function test2() {
	alert("bar");
}

function test3() {
	alert("foobar");
}


function Context(node,level,x,y) {
	this.node = node || null;
	this.level = level;
	this.x = x; this.y = y;
	
	this.items = {}
	this.num_items = 0;
	this.addItem('t1',test1);
	this.addItem('t2',test2);
	this.addItem('t3',test3);
	this.addItem('t32',test3);
	
	this.createMenu();
};

Context.prototype.addItem = function(name,func) {
	this.items[name] = func;
	this.num_items++;
}

Context.prototype.createMenu = function() {
	var n = this.num_items;
	var partition = 2*Math.PI/n;
	var radius = 30+Math.sqrt(n)*n;
	for(var c=0; c<n; c++) {
		var x = (radius*Math.cos(partition*c));
		var y = (radius*Math.sin(partition*c));
		R.path('M'+this.x+','+this.y+'l'+x+','+y).attr(
			{stroke:"#000",fill: "none", "stroke-width": 1.5});
			
		R.circle(this.x+x,this.y+y,30,20).attr(
			{stroke:"#000",fill: "#aabbcc", "stroke-width": 1, "text":"asdf"});;
	}
};