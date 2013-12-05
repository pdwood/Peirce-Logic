function addIteration(tree, nodes) {
	var source = nodes.begin().val.duplicate();
	var dest = nodes.begin().next.val;
	source.parent = dest;
	if (!source.isLeaf()) {
		dest.subtrees.push_back(source);
		source.restoreTree();
	}
	else {
		dest.leaves.push_back(source);
		source.restore();
	}
};


function deiteration(proof, rule_name, nodes) {
	proof.addNode(rule_name,this.RuleToId(rule_name),nodes);
	var dest = nodes.begin().next.val;
	var parent = dest.parent;
	parent.removeNode(dest);
};
