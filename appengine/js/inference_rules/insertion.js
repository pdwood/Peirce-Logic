InferenceRule.prototype.insertion = function (proof, rule_name, nodes) {
	var node = nodes.begin().val;

	var osubtrees = new List();
	node.subtrees.iterate(function (node) {
		osubtrees.push_back(node.getIdentifier());
	});
	var oleaves = new List();
	node.leaves.iterate(function (node) {
		oleaves.push_back(node.getIdentifier());
	});

	data = {'Nodes':[node.getIdentifier()],
			'OriginalSubtrees':osubtrees,
			'OriginalLeaves':oleaves};

	proof.addNode(rule_name+' Start',this.RuleToId(rule_name+' Start'),nodes,thunk,proof.LOGIC_MODES.INSERTION_MODE);
};

InferenceRule.prototype.insertion_for = function (mode) {
	return function(inf){
	return function(proof, nodes) {
		inf.insertion(proof, mode, nodes);
	};
	}(this);
};

/*InferenceRule.prototype.insertion_thunk_enter = function(rule_name) {
	return function(proofnode) {
		var node = proofnode.plane.getChildByIdentifier(this.data.Nodes[0]);
		node.shape.attr({'stroke-dasharray': '--'});
	};
};

InferenceRule.prototype.insertion_thunk_exit = function(rule_name) {
	return function(proofnode) {
		var node = proofnode.plane.getChildByIdentifier(this.data.Nodes[0]);
		node.shape.attr({'stroke-dasharray': ""});
	};
};
*/
