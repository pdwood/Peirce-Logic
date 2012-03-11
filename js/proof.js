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
	this.current.plane = new Level(null)
}
Proof.prototype.addnode = function () //all nodes after current will be removed
{
	this.current.next = new ProofNode(this);
	this.current.next.prev = this.current;
	this.current.next.plane = this.current.plane;
	this.current.plane = this.current.plane.duplicate();
	this.current = this.current.next;
}

Proof.prototype.empty_double_cut = function (treenode, x, y)
{
	treenode.addChild(x,y);
	treenode.children.rbegin().val.addChild(x,y);
}

Proof.prototype.double_cut = function (treenode, x, y)
{
	treenode.addChild(x,y);
	treenode.children.rbegin().val.addChild(x,y); //might need to make new function to add child that returns new
}

Proof.prototype.r_double_cut = function (treenode)
{
	if(treenode.parent && !treenode.variables.length && treenode.children.length == 1)
	{
		var p = treenode.children.begin();
		if(!p.variables.length && !p.children.length)
		{
			var itr = treenode.parent.children.begin();
			while(itr.val != treenode) {itr = itr.next;}
			treenode.parent.children.erase(itr);
		}
	}
}

Proof.prototype.insertion_cut = function(treenode,x,y)
{
	treenode.addChild(x,y);
}

Proof.prototype.insertion_variable = function(treenode,x,y)
{
	treenode.addVariable(x,y);
}