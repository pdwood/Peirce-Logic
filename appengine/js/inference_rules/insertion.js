InferenceRule.prototype.insertion = function (proof, rule_name, nodes) {
	var node = nodes.begin().val;
	var odash = node.shape.attr('stroke-dasharray');
	node.shape.attr({'stroke-dasharray': '--'});

	var osubtrees = new List();
	node.subtrees.iterate(function (node) {
		osubtrees.push_back(node.getIdentifier());
	});
	var oleaves = new List();
	node.leaves.iterate(function (node) {
		oleaves.push_back(node.getIdentifier());
	});

	data = {'Node':node.getIdentifier(),
			'OriginalSubtrees':osubtrees,
			'OriginalLeaves':oleaves};

	var transfer = function(proof) {
		var t = new InferenceRule();
		proof.addnode(rule_name+' End',t.RuleToId(rule_name+' End'),null,proof.LOGIC_MODES.PROOF_MODE);
	};

	var enter = function(t) {
		return function(proofnode) {
			var node = proofnode.plane.getChildByIdentifier(this.data.Node);
			node.shape.attr({'stroke-dasharray': '--'});
		};
	}(this);

	var exit = function(t) {
		return function(proofnode) {
			var node = proofnode.plane.getChildByIdentifier(this.data.Node);
			node.shape.attr({'stroke-dasharray': odash});
		};
	}(this);

	var thunk = new Thunk(data);
	thunk.enter = enter;
	thunk.exit = exit;
	thunk.transfer = transfer;

	proof.addnode(rule_name+' Start',this.RuleToId(rule_name+' Start'),thunk,proof.LOGIC_MODES.INSERTION_MODE);
};

InferenceRule.prototype.insertion_for = function (mode) {
	return function(inf){
	return function(proof, nodes) {
		inf.insertion(proof, mode, nodes);
	};
	}(this);
};
