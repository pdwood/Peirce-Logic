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

function NodeDiffToIdDiff(diff) {
	var idiff = NewDiff();
	for(var a in diff.additions)
		idiff.additions.push(a.getIdentifier());
	for(var d in diff.deletions)
		idiff.deletions.push(d.getIdentifier());
	for(var c in diff.changes) {
		if(c[1].parent)
			c[1].id = c[1].parent.getChildID();
		idiff.changes.push([c[0]], c[1].getIdentifier());
	}
	return idiff;
} 
