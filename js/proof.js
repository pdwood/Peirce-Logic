function ProofNode(p)
{
	this.plane = null;
	this.next = null;
	this.prev = null;
	this.proof = p;
}
ProofNode.prototype.serialize = function ()
{
	function recurse (treenode)
	{
		if(!treenode)
			return "";
		var data = "<Cut>";
		//get metadata of cut
		var p;
		for(p=treenode.variables.begin();p!=treenode.variables.end();p=p.next)
		{
			data += "<Var>";
			//get data out of variable
			data += "</Var>";
		}
		for(p=treenode.children.begin();p!=treenode.children.end();p=p.next)
		{
			data += recurse(p.val);
		}
		data += "</Cut>";
		return data;
	}
	var data = recurse(plane);
	plane = data;
}
ProofNode.prototype.unserialize = function ()
{
	//to be added later once serialize is complete
}
ProofNode.prototype.duplicate = function ()
{
	//to be added when func to duplicate tree nodes is created
	//returns pointer to new duplicate tree
	return null;
}
function Proof()
{
	this.current = new ProofNode(this);//current node displayed
}
Proof.prototype.addnode = function () //all nodes after current will be removed
{
	this.current.next = new ProofNode(this);
	this.current.next.prev = this.current;
	this.current.next.plane = this.current.plane;
	this.current.plane = this.current.plane.duplicate();
	this.current = this.current.next;
}
Proof.prototype.doublecut = function (treenode, x, y)
{
	this.addnode();
	treenode.addChild(x,y);
	treenode.children.rbegin().addChild(x,y); //might need to make new function to add child that returns new
}