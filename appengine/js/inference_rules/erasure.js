function AddErasure(tree, nodes) {
	proof.addNode(rule_name,this.RuleToId(rule_name),nodes);
	nodes.iterate(function(node) {
		var parent = node.parent;
		parent.removeNode(node);
	});
};

