function InferenceRule() {
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

function NewDiff() {
	return {additions: [], deletions: [], changes: []};
}
