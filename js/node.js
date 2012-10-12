/*
Node: tree node
~parent: parent pointer
~level: node depth in tree
*/
function Node(parent,id) {
	this.parent = parent || null;
	this.id = id;
	this.id_gen = 1;
	this.visited = false;
	this.subtrees = new List();
	this.leaves = new List();
};

Node.prototype.getNewID = function() {
	this.id_gen +=1;
	return this.id_gen;
}

//Gets the level of the node
Node.prototype.getLevel = function () {
	if(!this.parent)
		return 0;
	return this.parent.getLevel() + 1;
}

Node.prototype.isChild = function (node)
{
	if(!this.parent)
		return false;
	if(this.parent == node)
		return true;
	return this.parent.isChild(node);
}
