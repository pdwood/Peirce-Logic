function ProofNode(p) {
	this.plane = null;
	this.next = null;
	this.prev = null;
	this.proof = p;
	this.id = 1;
	this.name = 'undefined';
	this.isPremise = false;
}

function Proof(R) {
	this.paper = R;
	this.current = new ProofNode(this);//current node displayed
	this.current.plane = new Level(R,null);
	this.front = this.current;
	this.back = this.current;
	this.current.name = 'Premise Start';
}


//adds a node in the proof, must be called by all inference rules before tree is changed
//all nodes after current will be removed
Proof.prototype.addnode = function () {
	this.current.next = new ProofNode(this);
	this.current.next.prev = this.current;
	this.current.next.plane = this.current.plane;
	this.current.plane = this.current.plane.duplicate();
	this.current = this.current.next;
	this.current.id = this.current.prev.id + 1;
	this.back = this.current;
	timeline_f.draw.call(Timeline, {proof:this});
}

//moves proof to last step
Proof.prototype.prev = function() {
	if(this.current.prev) {
		this.current.plane.compressTree();
		this.current = this.current.prev;
		this.current.plane.restoreTree();
	}
}

//selects step from timeline
Proof.prototype.select = function(node) {
	if(this.current != node) {
		this.current.plane.compressTree();
		this.current = node;
		this.current.plane.restoreTree();
	}
}

//moves proof to next step
Proof.prototype.next = function () {
	if(this.current.next) {
		this.current.plane.compressTree();
		this.current = this.current.next;
		this.current.plane.restoreTree();
	}
}
//swaps proof to the step pointed to by proof node
Proof.prototype.swap = function (proof_node) {
	if(proof_node) {
		this.current.plane.compressTree();
		this.current = proof_node;
		this.current.plane.restoreTree();
	}
}

