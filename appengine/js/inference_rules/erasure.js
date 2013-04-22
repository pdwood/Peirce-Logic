InferenceRule.prototype.erasure = function (proof, rule_name, nodes) {
	proof.addnode(rule_name,this.RuleToId(rule_name),nodes);
	nodes.iterate(function(node) {
		var parent = node.parent;
		parent.removeNode(node);
	});
};

InferenceRule.prototype.erasure_for = function (mode) {
	return function(inf){
	return function(proof, nodes) {
		inf.erasure(proof, mode, nodes);
	};
	}(this);
};
