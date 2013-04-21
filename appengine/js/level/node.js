/*
Node: tree node
~parent: parent pointer
~level: node depth in tree
*/
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
}


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

Node.prototype.genChildID = function() {
	return this.id_gen++;
};

Node.prototype.getIdentifier = function() {
	if (this.parent)
		return this.id + "_" + this.parent.getIdentifier();
	else
		return this.id;
};

Node.prototype.getChildByIdentifier = function(id) {
	var aid = null;
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
