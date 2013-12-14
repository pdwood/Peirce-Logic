function ValidateConstructionErasure(tree, nodes) {
	return NodesAllHaveParent(nodes);
};

function ValidateProofErasure(tree, nodes) {
	return NodesAllHaveParent(nodes) && NodesAllOddLevel(nodes);
};

function ValidateInsertionErasure(tree, nodes) {

};

function AddErasure(tree, nodes) {
	var diff = NewDiff();
	nodes.iterate(function(node) {
		var parent = node.parent;
		parent.removeNode(node);
		diff.deletions.push(parent);
	});
	return [tree, NodeDiffToIdDiff(diff)];
};

