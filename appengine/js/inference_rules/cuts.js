function ValidateCut(tree, nodes) {
	return validateNCut(1, tree, nodes);
}

function ValidateInsertionCut(tree, nodes) {
	// TODO
}

function AddCut(tree, nodes) {
	return addNCut(1, tree, nodes);
}

function ValidateDoubleCut(tree, nodes) {
	return validateNCut(2, tree, nodes);
}

function ValidateInsertionDoubleCut(tree, nodes) {
	// TODO
}

function AddDoubleCut(tree, nodes) {
	return addNCut(2, tree, nodes);
}

function validateNCut(n, tree, nodes) {
	if(NodeAllHaveParent(nodes) && NodeAllSameParent(nodes))
		return true;
	return false;
}

function addNCut(n, tree, nodes) {
	var diff = NewDiff();

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
		diff.changes.push([node.getIdentifier(), node]);
		parent_list.erase(itr);
	});

	//add n-cut
	var p = nodes_parent.addSubtree();
	diff.addtions.push(p);
	n--;
	while(n>0) {
		p = p.addSubtree();
		diff.addtions.push(p);
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

	return [tree, NodeDiffToIdDiff(diff)];
}

//=========================================================

function ValidateEmptyCut(tree, nodes) {
	return validateEmptyNCut(1, tree, nodes);
}

function ValidateEmptyInsertionCut(tree, nodes) {
	// TODO
}

function AddEmptyCut(tree, nodes) {
	return addEmptyNCut(1, tree, nodes);
}

function ValidateEmptyDoubleCut(tree, nodes) {
	return validateEmptyNCut(2, tree, nodes);
}

function ValidateEmptyInsertionDoubleCut(tree, nodes) {
	// TODO
}

function AddEmptyDoubleCut(tree, nodes) {
	return addEmptyNCut(2, tree, nodes);
}

function validateEmptyNCut(n, tree, nodes) {
	if(nodes.length == 1) {
		var node = nodes.begin().val;
		if(!node.isLeaf())
			return true;
	}
	return false;
}

function addEmptyNCut(n, tree, nodes) {
	var diff = NewDiff();

	var p = nodes.begin().val.addSubtree();
	diff.addtions.push(p);
	n--;
	while(n>0) {
		p = p.addSubtree();
		diff.addtions.push(p);
		n--;
	}

	return [tree, NodeDiffToIdDiff(diff)];
}

//=========================================================

function ValidateReverseCut(tree, nodes) {
	return validateReverseNCut(1, tree, nodes);
}

function ValidateReverseInsertionCut(tree, nodes) {
	// TODO
}

function AddReverseCut(tree, nodes) {
	return addReverseNCut(1, tree, nodes);
}

function ValidateReverseDoubleCut(tree, nodes) {
	return validateReverseNCut(2, tree, nodes);
}

function ValidateReverseInsertionDoubleCut(tree, nodes) {
	// TODO
}

function AddReverseDoubleCut(tree, nodes) {
	return addReverseNCut(2, tree, nodes);
}

function validateReverseNCut(n, tree, nodes) {
	if(!((NodeAllHaveParent(nodes) && NodeAllSameParent(nodes))))
		return false;
	else if(nodes.length == 0) {
		return false;
	}
	var node = nodes.begin().val;
	var p;
	if (!node.isLeaf() && node.subtrees.length == 0 && node.leaves.length == 0 && node.parent)
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

function addReverseNCut(n, tree, nodes) {
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
