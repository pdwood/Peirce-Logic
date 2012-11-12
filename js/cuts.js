InferenceRule.prototype.n_cut = function (proof, rule_name, n, nodes) {
	proof.addnode(rule_name,this.RuleToId(rule_name));

	var ax = 0;
	var ay = 0;
	//remove children from parent
	nodes.iterate(function(node) {
		var parent_list = 0;
		if(node instanceof Level) {
			parent_list = node.parent.subtrees; 
			ax += node.shape.getBBox().x+node.shape.getBBox().width/2;
			ay += node.shape.getBBox().y+node.shape.getBBox().height/2;
		}
		else {
			parent_list = node.parent.leaves; 
			ax += node.text.getBBox().x+node.text.getBBox().width/2;
			ay += node.text.getBBox().y+node.text.getBBox().height/2;
		}		
		var itr = parent_list.skipUntil(function(p) {
			return (p === node);
		});
		parent_list.erase(itr);
	});

	//add n-cut
	ax = ax/nodes.length;
	ay = ay/nodes.length;
	//var p = node.parent.addChild(r_attrs.x + (r_attrs.width/2), r_attrs.y + (r_attrs.height/2));
	//	p = p.addChild(r_attrs.x + (r_attrs.width/2), r_attrs.y + (r_attrs.height/2));
	var p = node.parent.addChild(ax , ay); 
	while(n>0) {
		p = p.addChild(ax, ay);
		n--;
	}

	//insert children into n-cut
	nodes.iterate(function(node) {
		var bbox = 0;
		var children_list = 0;
		if(node instanceof Level) { 
			bbox = node.shape.getBBox();
			children_list = p.subtrees;
		}
		else if(node instanceof Variable) { 
			bbox = node.text.getBBox();
			children_list = p.leaves;
		}
		//changes parent
		node.parent = p;
		//if cut puts in children list
		children_list.push_back(node);
		node.updateLevel(); 
		//expands the doublecut
		p.expand(bbox.x,bbox.y,bbox.width,bbox.height);
		//move collided nodes out of way
		//p.shiftAdjacent(node,node.shape.getBBox());
		//p.contract();
	});
};

InferenceRule.prototype.empty_n_cut = function (proof, rule_name, n, node, x, y) {
	proof.addnode(rule_name,this.RuleToId(rule_name));

	var p = node.begin().val.addChild(x,y);
	n--;
	while(n>0) {
		p = p.addChild(x,y);
		n--;
	}
};


InferenceRule.prototype.validate_reverse_n_cut = function (n, nodes) {
	var p = nodes.begin().val.parent;
	n--;
	if(!p || (!p.parent && n<=0)) return false;

	while(n>0){
		p = p.parent;
		n--;
		if(!p || (!p.parent && (!p.variables.length && p.subtrees.length == 1)))
			return false;
	}
	return true;
};

InferenceRule.prototype.reverse_n_cut = function (proof, rule_name, n, nodes) {
	proof.addnode(rule_name,this.RuleToId(rule_name));

	tparent = nodes.begin().val.parent;
	while(n>0) {
		tparent = tparent.val.parent;
		n--;
	}
	tgrandparent = tparent.parent;
			
	//changes parent
	nodes.iterate(function(node) {
		node.parent = tgrandparent;
	});
			
	//erase cuts
	var itr = tgrandparent.subtrees.skipUntil(function(x) {
		return (x === tparent);
	});
	itr.val.compress();
	tgrandparent.subtrees.erase(itr);
	
	nodes.iterate(function(node) {
		var bbox = 0;
		var children_list = 0;
		if(node instanceof Level) { 
			bbox = node.shape.getBBox();
			children_list = children_list.subtrees;
		}
		else if(node instanceof Variable) { 
			bbox = node.text.getBBox();
			children_list = children_list.leaves;
		}

		//if node puts in children list
		children_list.push_back(node);
		node.updateLevel(); 
		//expands the doublecut
		tgrandparent.expand(bbox.x,bbox.y,bbox.width,bbox.height);
		//move collided nodes out of way
		//p.shiftAdjacent(treenode,treenode.shape.getBBox());
		//p.contract();
	});
};

InferenceRule.prototype.n_cut_for = function (n,mode) {
	return function(inf){
	return function(proof,nodes) {
		inf.n_cut(proof,mode,n,nodes);
	};
	}(this);
};

InferenceRule.prototype.empty_n_cut_for = function (n,mode) {
	return function(inf){
	return function(proof,nodes,x,y) {
		inf.empty_n_cut(proof,mode,n,nodes,x,y);
	};
	}(this);
};

InferenceRule.prototype.reverse_n_cut_for = function (n,mode) {
	return function(inf){
	return function(proof,nodes) {
		inf.reverse_n_cut(proof,mode,n,nodes);
	};
	}(this);
};
