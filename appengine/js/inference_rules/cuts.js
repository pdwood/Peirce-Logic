function addNCut(n, tree, nodes, attrs) {
	nodes_parent = nodes.begin().val.parent;

	//remove children from parent
	nodes.iterate(function(node) {
		var parent_list = 0;
		if(!node.isLeaf()) {
			parent_list = node.parent.subtrees;
		}
		else {
			parent_list = node.parent.leaves;
		}
		var itr = parent_list.skipUntil(function(p) {
			return (p === node);
		});
		parent_list.erase(itr);
	});

	//add n-cut
	var p = nodes_parent.addSubtree();
	n--;
	while(n>0) {
		p = p.addSubtree();
		n--;
	}

	//insert children into n-cut
	nodes.iterate(function(node) {
		var children_list = 0;
		if(!node.isLeaf()) {
			children_list = p.subtrees;
		}
		else if(node.isLeaf()) {
			children_list = p.leaves;
		}
		//changes parent
		node.parent = p;
		//if cut puts in children list
		children_list.push_back(node);
	});
}

function addEmptyNCut(tree, nodes, attrs) {
	var p = nodes.begin().val.addSubtree();
	n--;
	while(n>0) {
		p = p.addSubtree();
		n--;
	}
}

function validateReverseNCut(tree, nodes) {
	var node = nodes.begin().val;
	var p;
	if (!node.isLeaf() && node.subtrees.length() == 0 && node.leaves.length() == 0 && node.parent)
		p = node;
	else
		p = node.parent;
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
	var enter = function(t) {
		return function() {
			this.data.Node.shape.attr({'stroke-dasharray': '--'});
		};
	}(this);

	var exit = function(t) {
		return function() {
			this.data.Node.shape.attr({'stroke-dasharray': odash});
		};
	}(this);


	proof.addNode(rule_name,this.RuleToId(rule_name),nodes);

	var tparent;
	if(nodes.length==1) {
		var node = nodes.begin().val;
		if(node instanceof Level && !node.leaves.length && !node.subtrees.length)
			tparent = node;
		else
			tparent = node.parent;
	}
	else
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
