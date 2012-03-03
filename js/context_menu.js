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
	this.items['t1'] = test1;
	this.items['t2'] = test2;
	this.items['t3'] = test3;
	
	this.createMenu();
};

Context.prototype.createMenu = function() {
	var n = 8;
	var partition = 2*Math.PI/n;
	var radius = 30;
	for(var c=0; c<n; c++) {
		R.path(
					 'M'+this.x+','+this.y
					+'l'+(radius*Math.cos(partition*c))
						+','+(radius*Math.sin(partition*c))
					).attr({stroke:"#000",fill: "none", "stroke-width": 2});
	}
};