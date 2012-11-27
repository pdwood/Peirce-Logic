InferenceRule.prototype.n_cut = function (proof, rule_name, n, nodes) {
	proof.addnode(rule_name,this.RuleToId(rule_name));
	nodes_parent = nodes.begin().val.parent;

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
			ax += node.text.attrs.x;
			ay += node.text.attrs.y;
		}
		var itr = parent_list.skipUntil(function(p) {
			return (p === node);
		});
		parent_list.erase(itr);
	});

	//add n-cut
	ax = ax/nodes.length;
	ay = ay/nodes.length;
	var p = nodes_parent.addChild(ax , ay);
	n--;
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
		p.expand(bbox.x,bbox.y,bbox.width,bbox.height,true);
		//move collided nodes out of way
		p.shiftAdjacent(node,bbox);
		p.contract();
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
		if(!p || !(p.parent && !p.leaves.length && p.subtrees.length == 1))
			return false;
	}
	p = nodes.begin().val.parent;
	if(p.subtrees.length + p.leaves.length === nodes.length)
		return true;
	return false;
};

InferenceRule.prototype.reverse_n_cut = function (proof, rule_name, n, nodes) {
	proof.addnode(rule_name,this.RuleToId(rule_name));

	tparent = nodes.begin().val.parent;
	tparent.compress();
	n--;
	while(n>0) {
		tparent = tparent.parent;
		tparent.compress();
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
	tgrandparent.subtrees.erase(itr);

	nodes.iterate(function(node) {
		var bbox = 0;
		var children_list = 0;
		if(node instanceof Level) {
			bbox = node.shape.getBBox();
			children_list = tgrandparent.subtrees;
		}
		else if(node instanceof Variable) {
			bbox = node.text.getBBox();
			children_list = tgrandparent.leaves;
		}
		//if node puts in children list
		children_list.push_back(node);
		node.updateLevel();
		//expands the doublecut
		tgrandparent.expand(bbox.x,bbox.y,bbox.width,bbox.height);
		//move collided nodes out of way
		tgrandparent.shiftAdjacent(node,bbox);
		tgrandparent.contract(true);
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
