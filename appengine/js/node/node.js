function Node(parent) {
	this.parent = parent || null;
	if(!this.parent)
		this.id = 0;
	else
		this.id = this.parent.genChildID();
	this.visited = false;
	this.subtrees = new List();
	this.leaves = new List();
	this.id_gen = 0;
    this.context = null;
}

// generate dict of id -> child
Node.prototype.toDict = function () {
    var dict = {};
    this.toDictChild(dict);
};

Node.prototype.toDictChild = function (dict) {
    dict[this.getIdentifier()] = this;
    this.leaves.iterate(function(x) {
        dict[x.getIdentifier()] = x;
    });
    this.subtrees.iterate(function(x) {
        dict[x.getIdentifier()] = x;
        x.toDictChild(dict);
    });
};

//Gets the level of the node
Node.prototype.getLevel = function () {
	if(!this.parent)
		return 0;
	return this.parent.getLevel() + 1;
};

Node.prototype.isChild = function (node) {
	if(!this.parent)
		return false;
	if(this.parent == node)
		return true;
	return this.parent.isChild(node);
};

Node.prototype.isLeaf = function () {
    if(this.subtrees.length > 0 || this.leaves.length >0)
        return true;
    return false;
};

Node.prototype.genChildID = function() {
	return this.id_gen++;
};

Node.prototype.getIdentifier = function() {
	if (this.parent)
		return this.id + "_" + this.parent.getIdentifier();
	else
		return this.id;
};

Node.prototype.addSubtree = function() {
    var child = new Node(this);
    // fix ids here
    this.subtrees.push_back(child);
    return child;
};

Node.prototype.fmap = function(func) {
	func(this);
	this.leaves.iterate(function(node) { node.fmap(func); });
	this.subtrees.iterate(function(node) { node.fmap(func); });
}

/* To do: make fmap etc.
Node.prototype.refreshIDs = function() {
	this.id_gen = 0;
	for children
		child.refreshIDs();
};
*/

Node.prototype.addLeaf = function() {
    var child = new Node(this);
    this.leaves.push_back(child);
    return child;
};

Node.prototype.getChildByIdentifier = function(id) {
	var aid = null; // branch id list
	if(typeof id === "string") {
		aid = id.split("_");
	} else {
		aid = [id];
	}
	aid.reverse();
	var id_node;
	if (parseInt(aid[0]) === this.id) {
		if (aid.length>=2) {
			var slice;
			if(aid.length==2) {
				slice = aid[1];
			} else {
				slice = aid.slice(1,aid.length);
			}
			var itr = this.subtrees.begin();
			while(itr!=this.subtrees.end()) {
				var found_node = itr.val.getChildByIdentifier(slice);
				if (found_node)
					id_node = found_node;
				itr = itr.next;
			}
			itr = this.leaves.begin();
			while(itr!=this.leaves.end()) {
				var found_node = itr.val.getChildByIdentifier(slice);
				if (found_node)
					id_node = found_node;
				itr = itr.next;
			}
		} else {
			return this;
		}
	}
	return id_node;
};

Node.prototype.duplicate = function() {
	var dup = new Node(this.parent);
    if(!dup.parent)
		dup.id = 0;
	else
		dup.id = this.parent.genChildID();
	// Maybe something with gen_id?

    this.subtrees.iterate(function(x){
            child_dup = x.duplicate();
            child_dup.parent = dup;
            dup.subtrees.push_back(child_dup);
    });
    this.leaves.iterate(function(x){
            variable_dup = x.duplicate();
            variable_dup.parent = dup;
            dup.leaves.push_back(variable_dup);
    });
    return dup;
};
