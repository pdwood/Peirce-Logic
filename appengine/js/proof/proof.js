function ProofNode(nodeTree) {
    this.nodeTree = nodeTree; // main node of tree
    this.uiSet = null; // ui set used to hold ui nodes when rendering node

	this.next = new List();
	this.prev = null;

	// proof node properties, serilizable
    this.uiAttr = null; // node id -> attr map
    this.ruleName =  null; // rule name used to find applicator and validator
    this.ruleNodes =  null; // string map to node ids used to in applicator
    this.mode =  null; // mode node is in
}

ProofNode.prototype.constructUI = function(R) {
    this.uiSet = new UINodeTree(R, this.nodeTree, Level, Variable, this.uiAttr);
    this.uiSet.constructUI();
}

function ProofTreeTrim(node){
	if(node.prev == null){
		return node;
	}

	//Delete proof offshoots by ensuring each node in the main path is an only child.
	node.prev.next = new List();
	node.prev.next.push_back(node);

	return ProofTreeTrim(node.prev);
}

ProofNode.prototype.deconstructUI = function() {
    if(this.uiSet) {
        this.uiSet.deconstructUI();
        this.uiSet = null;
    }
}

function Proof(R) {
	this.paper = R;
	// main logic modes
	this.LOGIC_MODES = {
        PREMISE_MODE: 0, 
        PROOF_MODE: 1, 
        INSERTION_MODE: 2, 
        GOAL_MODE: 3};

	// ui reactor map
	this.eventReactors = {};
	this.EVENTS = {
		CHANGE_MODE: 'changeMode',
		ADD_NODE: 'addNode',
		SELECT_NODE: 'select',
		NEXT_NODE: 'next',
		PREVIOUS_NODE: 'prev',
		//AUTOMATED_CHECK: 'automated_check'
	};

	// mode of proof
	this.currentMode = this.LOGIC_MODES.GOAL_MODE;
	this.previousMode = this.LOGIC_MODES.GOAL_MODE;

	// initial seed
    this.nodeSeed = new Node(null);

	this.current = new ProofNode(this.nodeSeed); //current node displayed
	this.current.mode = this.currentMode;
	this.front = this.current;

	this.changeMode(this.currentMode);
}

Proof.prototype.addReactor = function(event, func) {
	this.eventReactors[event] = func;
};


Proof.prototype.removeReactor = function(event) {
	if (event in this.eventReactors)
		delete this.eventReactors[event];
};

Proof.prototype.activateReactor = function(event) {
	if (event in this.eventReactors)
		this.eventReactors[event](this);
}

Proof.prototype.changeMode = function(mode) {
	this.previousMode = this.currentMode;
	if (mode === this.LOGIC_MODES.PREMISE_MODE) {
		this.currentMode = this.LOGIC_MODES.PREMISE_MODE;
	}
	if (mode === this.LOGIC_MODES.PROOF_MODE) {
		this.currentMode = this.LOGIC_MODES.PROOF_MODE;
	}
	if (mode === this.LOGIC_MODES.INSERTION_MODE) {
		this.currentMode = this.LOGIC_MODES.INSERTION_MODE;
	}
	if (mode === this.LOGIC_MODES.GOAL_MODE) {
		this.currentMode = this.LOGIC_MODES.GOAL_MODE;
	}

	this.activateReactor(this.EVENTS.CHANGE_MODE);
};

//adds a node in the proof, must be called by all inference rules before tree is changed
Proof.prototype.addNode = function (rule,ruleApplicator,ruleNodes,thunk) {
    var newTree = ruleApplicator(this.current.nodeTree);
	var node = new ProofNode(newTree);
	node.prev = this.current;
	node.ruleName = rule;
    node.ruleApplicator = ruleApplicator;
    node.ruleNodes = ruleNodes;
    node.thunk = thunk;

    this.current.deconstructUI();
	this.current.next.push_back(node);
	this.current = node;
    this.current.constructUI();

	this.activateReactor(this.EVENTS.ADD_NODE);
};

/*
Proof.prototype.automated_check = function(pnode) {
	gnode = pnode;
	while(gnode.mode !== this.LOGIC_MODES.GOAL_MODE) {
		gnode = gnode.prev;
	}
	gnode.constructUI();
	var eq = gnode.plane.equivalence(pnode.plane);
	gnode.plane.compressTree();
	if(eq) {
		smoke.alert('Reached Goal');
		playerButtons();
	}
};
	gnode.deconstructUI();
	if(eq)
		smoke.alert('Reached Goal');
};*/

//moves proof to last step
Proof.prototype.prev = function() {
	if(this.current.prev) {
		this.current.deconstructUI();
		this.current = this.current.prev;
		this.current.constructUI();
		this.activateReactor(this.EVENTS.PREVIOUS_NODE);
	}
};

//selects step from timeline
Proof.prototype.select = function(node) {
	D(node)
	if(this.current !== node) {
		this.current.deconstructUI();
		this.current = node;
		this.current.constructUI();
		this.changeMode(this.current.mode);
		//if(node.mode !== this.LOGIC_MODES.GOAL_MODE && node.mode !== this.LOGIC_MODES.PREMISE_MODE)
			//this.automated_check(this.current);
		this.activateReactor(this.EVENTS.SELECT_NODE);
	}
};

//moves proof to next step
Proof.prototype.next = function () {
	if(this.current.next) {
		this.current.deconstructUI();
		this.current = this.current.next;
		this.current.constructUI();
		this.activateReactor(this.EVENTS.NEXT_NODE);
	}
};
