function InferenceRule(thunk) {
	this.rules = [
		'Construction: Variable',
		'Construction: Cut',
		'Construction: Erasure',
		'Construction: Double Cut',
		'Construction: Reverse Cut',
		'Construction: Reverse Double Cut',
		'Construction: Empty Cut',
		'Construction: Empty Double Cut',
		'Construction: Iteration',
		'Construction: Deiteration',

		'Proof: Double Cut',
		'Proof: Reverse Double Cut',
		'Proof: Empty Double Cut',
		'Proof: Iteration',
		'Proof: Deiteration',
		'Proof: Erasure',
		'Proof: Insertion Start',
		'Proof: Insertion End',

		'Proof: Goal Constructed',
		'Proof: Premise Constructed',

		'Construction: PL Statement'
	];
	this.thunk = thunk;
}

InferenceRule.prototype.IdToRule = function (rule_name) {
	return this.rules.indexOf(rule_name);
};

InferenceRule.prototype.RuleToId = function(rule_id) {
	if(rule_id>=0 && rule_id<this.rules.length)
		return this.rules[rule_id];
	return 'InvalidRule';
};

InferenceRule.prototype.variable = function (proof, rule_name, nodes) {
	proof.addnode(rule_name,this.RuleToId(rule_name),nodes);
	return nodes.begin().val.addLeaf();
};

InferenceRule.prototype.variable_for = function(mode) {
	return function(inf){
	return function(proof, nodes, x, y) {
		inf.variable(proof, mode, nodes, x, y);
	};
	}(this);
};

