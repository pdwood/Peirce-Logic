function ProofNode() {
	this.plane = null;

	this.next = new List();
	this.prev = null;
	this.id = 1;
	this.id_gen = 1;

	this.rule_name = null;
	this.rule_id = null;

	this.mode = null;
	this.thunk = null;
}

function Proof(R) {
	this.paper = R;
	this.current = new ProofNode();//current node displayed
	this.current.plane = new Level(R,null);
	this.front = this.current;

	this.current.plane = new Level(R,null);
}


//adds a node in the proof, must be called by all inference rules before tree is changed
Proof.prototype.addnode = function (rule,rule_id) {
	var node = new ProofNode();
	node.plane = this.current.plane;
	node.prev = this.current;
	node.id = this.id_gen++;
	node.rule_name = rule;
	node.rule_id = rule_id;
	this.mode = 0;
	this.thunk = 0;

	this.current.next.push_back(node);
	this.current.plane = this.current.plane.duplicate();
	this.current = node;

	branches.draw.call(Timeline, this);
};

//moves proof to last step
Proof.prototype.prev = function() {
	if(this.current.prev) {
		this.current.plane.compressTree();
		this.current = this.current.prev;
		this.current.plane.restoreTree();
	}
};

//selects step from timeline
Proof.prototype.select = function(node) {
	if(this.current !== node) {
		this.current.plane.compressTree();
		this.current = node;
		this.current.plane.restoreTree();
	}
};

//moves proof to next step
Proof.prototype.next = function () {
	if(this.current.next) {
		this.current.plane.compressTree();
		this.current = this.current.next;
		this.current.plane.restoreTree();
	}
};

//swaps proof to the step pointed to by proof node
Proof.prototype.swap = function (proof_node) {
	if(proof_node) {
		this.current.plane.compressTree();
		this.current = proof_node;
		this.current.plane.restoreTree();
	}
};

