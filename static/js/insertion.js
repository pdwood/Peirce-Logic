InferenceRule.prototype.insertion = function (proof, rule_name, nodes) {
	proof.addnode(rule_name+' Start',this.RuleToId(rule_name+' Start'));
	var node = nodes.begin().val;
	var odash = node.shape.attr('stroke-dasharray');
	node.shape.attr({'stroke-dasharray': '--'});

	var reset_func = function(t) {
		return function(thunk) {
			thunk.Proof.addnode(rule_name+' End',t.RuleToId(rule_name+' End'));
			thunk.Node.shape.attr({'stroke-dasharray': odash});
		};
	}(this);

	var osubtrees = new List();
	node.subtrees.iterate(function (node) {
		osubtrees.push_back(node);
	});
	var oleaves = new List();
	node.leaves.iterate(function (node) {
		oleaves.push_back(node);
	});

	this.MH.ChangeMode(this.MH.LogicMode.INSERTION_MODE,{'Node':node,
												'OriginalSubtrees':osubtrees,
												'OriginalLeaves':oleaves,
												'Proof':proof,
												'Reset':reset_func});
};

InferenceRule.prototype.insertion_for = function (mode) {
	return function(inf){
	return function(proof, nodes) {
		inf.insertion(proof, mode, nodes);
	};
	}(this);
};
