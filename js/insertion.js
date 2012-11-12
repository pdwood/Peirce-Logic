InferenceRule.prototype.insertion = function(treenode,plane) {
	if(!(treenode.getLevel() % 2)) {//checks for odd level
		this.addnode();
		this.subtrees.iterate(function(c){ 
			c.parent = treenode;
			//make sure that coordinates changed for full proof
			treenode.expand(c.shape.attrs.x,c.shape.attrs.y,c.shape.attrs.width,c.shape.attrs.height);
		});
		treenode.subtrees.append(plane.subtrees);
		this.leaves.iterate(function(c){ 
			c.parent = treenode;
			//make sure that coordinates changed for full proof
			//may need to expand treenode
		});
		treenode.leaves.append(plane.leaves);
	}
	this.current.name = 'Insertion';
};
