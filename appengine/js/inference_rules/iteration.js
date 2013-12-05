function ValidateIteration(tree, nodes) {
	if (nodes.length==2){
		var node1 = nodes.begin().val;
		var node2 = nodes.begin().next.val;
		var node_source;
		var node_dest;
		if(node1.getLevel() > node2.getLevel()) {
			node_source = node2;
			node_dest = node1;
		}
		else {
			node_source = node1;
			node_dest = node2;
		}

		if (!node_dest.isLeaf()) {
			var main_parent = node_source.parent;
			var ancestor = node_dest.parent;
			var share_ancestor = false;
			while(ancestor!==null) {
				if(main_parent === ancestor) {
					share_ancestor = true;
					break;
				}
				ancestor = ancestor.parent;
			}
			if(share_ancestor) {
				return true;
			}
		}
	}
	return false;
};

function AddIteration(tree, nodes) {
	var diff = NewDiff();
	var source = nodes.begin().val.duplicate();
	var dest = nodes.begin().next.val;
	source.parent = dest;
	if (!source.isLeaf()) {
		dest.subtrees.push_back(source);
	}
	else {
		dest.leaves.push_back(source);
	}
	source.refreshIDs();
	diff.additions.push(source);
	return [tree, NodeDiffToIdDiff(diff)];
};

function ValidateDeiteration(tree, nodes) {
	if (nodes.length==2){
		var node1 = nodes.begin().val;
		var node2 = nodes.begin().next.val;
		var node_source;
		var node_dest;
		if(node1.getLevel() > node2.getLevel()) {
			node_source = node2;
			node_dest = node1;
		}
		else {
			node_source = node1;
			node_dest = node2;
		}
		if (!node_dest.isLeaf()) {
			var main_parent = node_source.parent;
			var ancestor = node_dest.parent;
			var share_ancestor = false;
			while(ancestor!==null) {
				if(main_parent === ancestor) {
					share_ancestor = true;
					break;
				}
				ancestor = ancestor.parent;
			}
			if(share_ancestor) {
				iteration_nodes = new List();
				iteration_nodes.push_back(node_source);
				iteration_nodes.push_back(node_dest);
				if(node_source.isLeaf() && node_dest.isLeaf()) {
					if (node_source.getName() === node_dest.getName()) {
						return true;
					}
					else {
						return false;
					}
				}
				else if (!(node_source.isLeaf() || node_dest.isLeaf())) {
					if (node_source.equivalence(node_dest)) {
						return true;
					}
					else {
						return false;
					}
				}
				else {
					return false;
				}
			}
		}
	}
};

function AddDeiteration(tree, nodes) {
	var diff = NewDiff();
	var dest = nodes.begin().next.val;
	diff.deletions.push(dest);
	var parent = dest.parent;
	parent.removeNode(dest);
	return [tree, NodeDiffToIdDiff(diff)];
};


