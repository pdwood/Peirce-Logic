/*
Node: tree node
~parent: parent pointer
~level: node depth in tree
*/
function Node(parent) {
	this.parent = parent || null;
	if(this.parent)
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
		return this.id + "_" + this.parent.getIdentifier;
	else
		return this.id;
};
