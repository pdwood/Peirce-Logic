function ProofNode() {
	this.plane = null;

	this.next = new List();
	this.prev = null;
	this.id = 1;
	this.id_gen = 1;

	this.rule_name = null;
	this.rule_id = null;

	this.mode = 0;
	this.thunk = null;
}

function Thunk(data) {
	this.data = data;

	this.transfer = Thunk.Default_Transfer;
	this.enter = Thunk.Default_Enter;
	this.exit = Thunk.Default_Exit;
}

Thunk.Default_Enter = function(proof) {
	return;
};

Thunk.Default_Exit = function(proof) {
	return;
};

Thunk.Default_Transfer = function(proof) {
	return;
};


function Proof(R) {
	this.paper = R;
	this.LOGIC_MODES = {PREMISE_MODE: 0, PROOF_MODE: 1, INSERTION_MODE: 2, GOAL_MODE: 3};
	this.CURRENT_MODE = this.LOGIC_MODES.GOAL_MODE;
	this.PREVIOUS_MODE = this.LOGIC_MODES.GOAL_MODE;

	this.current = new ProofNode();//current node displayed
	this.current.plane = new Level(R,null);
	this.current.mode = this.CURRENT_MODE;
	this.current.thunk = new Thunk({});
	this.current.thunk.transfer = function(proof) {
		var t = new InferenceRule();
		proof.addnode("Proof: Goal Constructed",t.RuleToId("Proof: Goal Constructed"),null,this.LOGIC_MODES.PREMISE_MODE);
	};

	this.thunk = this.current.thunk;
	this.front = this.current;

	this.current.plane = new Level(R,null);
	this.change_mode(this.CURRENT_MODE);
}

Proof.prototype.change_mode = function(mode) {
	this.PREVIOUS_MODE = this.CURRENT_MODE;

	mode_name = "";
	warning_color = "";
	if (mode === this.LOGIC_MODES.PREMISE_MODE) {
		this.CURRENT_MODE = this.LOGIC_MODES.PREMISE_MODE;
		mode_name = "Premise Mode";
		warning_color = "label-success";
	}
	if (mode === this.LOGIC_MODES.PROOF_MODE) {
		this.CURRENT_MODE = this.LOGIC_MODES.PROOF_MODE;
		mode_name = "Proof Mode";
		warning_color = "label-info";
	}
	if (mode === this.LOGIC_MODES.INSERTION_MODE) {
		this.CURRENT_MODE = this.LOGIC_MODES.INSERTION_MODE;
		mode_name = "Insertion Mode";
		warning_color = "label-warning";
	}
	if (mode === this.LOGIC_MODES.GOAL_MODE) {
		this.CURRENT_MODE = this.LOGIC_MODES.GOAL_MODE;
		mode_name = "Goal Mode";
		warning_color = "label-important";
	}
	style = 'style="font-size: 12px; margin-top: 8px; -webkit-border-radius: 10px; -moz-border-radius: 10px; border-radius: 10px;"';
	document.getElementById('ModeLink').innerHTML = '<span class="label '+ warning_color +'" '+ style +'>'+mode_name+'</span>';
};

Proof.prototype.execute_transfer = function() {
	this.current.thunk.transfer(this);
};


//adds a node in the proof, must be called by all inference rules before tree is changed
Proof.prototype.addnode = function (rule,rule_id,thunk,mode) {
	var node = new ProofNode();
	node.plane = this.current.plane;
	node.prev = this.current;
	node.id = this.id_gen++;
	node.rule_name = rule;
	node.rule_id = rule_id;
	if(mode>=0)
		node.mode = mode;
	else
		node.mode = this.CURRENT_MODE;

	if(!thunk) {
		node.thunk = new Thunk({});
		if(node.mode == this.LOGIC_MODES.PREMISE_MODE || node.mode == this.LOGIC_MODES.GOAL_MODE) {
			mode_name = "";
			mode_n = 0;
			if(node.mode == this.LOGIC_MODES.PREMISE_MODE) {
				mode_name = "Proof: Premise Constructed";
				mode_n = this.LOGIC_MODES.PROOF_MODE;
			}
			else {
				mode_name = "Proof: Goal Constructed";
				mode_n = this.LOGIC_MODES.PREMISE_MODE;
			}
			node.thunk.transfer = function(mode_name) {
				return function(proof) {
					var t = new InferenceRule();
					proof.addnode(mode_name,t.RuleToId(mode_name),null,mode_n);
				};
			}(mode_name,mode_n);
		} else if (node.mode == this.LOGIC_MODES.INSERTION_MODE) {
			node.thunk = this.thunk;
		}
	}
	else
		node.thunk = thunk;


	this.current.next.push_back(node);
	if(mode >= 0 && mode == this.LOGIC_MODES.PREMISE_MODE && this.CURRENT_MODE ==this.LOGIC_MODES.GOAL_MODE) {
		this.current.plane.compressTree();
		node.plane = new Level(this.paper,null);
	}
	else
		this.current.plane = this.current.plane.duplicate();
	this.current = node;

	this.rethunk(this.current.thunk);

	if(mode>=0 && mode != this.CURRENT_MODE)
		this.change_mode(mode);

	if(node.mode !== this.LOGIC_MODES.GOAL_MODE && node.mode !== this.LOGIC_MODES.PREMISE_MODE)
		this.automated_check(this.current);
	branches.draw.call(Timeline, this);
};

Proof.prototype.rethunk = function(thunk) {
	this.thunk.exit(this.current);
	this.thunk = thunk;
	this.thunk.enter(this.current);
};

Proof.prototype.automated_check = function(pnode) {
	gnode = pnode;
	while(gnode.mode !== this.LOGIC_MODES.GOAL_MODE) {
		gnode = gnode.prev;
	}
	gnode.plane.restoreTree();
	var eq = gnode.plane.equivalence(pnode.plane);
	gnode.plane.compressTree();
	if(eq)
		alert('Reached Goal');
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
		this.rethunk(this.current.thunk);
		this.change_mode(this.current.mode);
		if(node.mode !== this.LOGIC_MODES.GOAL_MODE && node.mode !== this.LOGIC_MODES.PREMISE_MODE)
			this.automated_check(this.current);
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

