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
function Proof()
{
	this.current = new ProofNode(this);//current node displayed
	this.current.plane = new Level(null);
	this.setMasterPlane(this.current.plane);
}
//set Rapael's master plane
Proof.prototype.setMasterPlane = function(p) {
	R.plane = p;
}
//adds a node in the proof, must be called by all inference rules before tree is changed
Proof.prototype.addnode = function () //all nodes after current will be removed
{
	this.current.next = new ProofNode(this);
	this.current.next.prev = this.current;
	this.current.next.plane = this.current.plane;
	this.current.plane = this.current.plane.duplicate();
	this.current = this.current.next;
}
//moves proof to last step
Proof.prototype.prev = function()
{
	if(this.current.prev)
	{
		this.current.plane.compressTree();
		this.current = this.current.prev;
		this.current.plane.restoreTree();
	}
}
//moves proof to next step
Proof.prototype.next = function ()
{
	if(this.current.next)
	{
		this.current.plane.compressTree();
		this.current = this.current.next;
		this.current.plane.restoreTree();
	}
}
//swaps proof to the step pointed to by proof node
Proof.prototype.swap = function (proof_node)
{
	if(proof_node)
	{
		this.current.plane.compressTree();
		this.current = proof_node;
		this.current.plane.restoreTree();
	}
}
//creates a empty doublecut at x,y
Proof.prototype.empty_double_cut = function (treenode, x, y)
{
	this.addnode();
	var p = treenode.addChild(x,y);
	p.addChild(x,y);
}
//creates a doublecut around treenode(cut) variables to be added later
Proof.prototype.double_cut = function (treenode)
{
	if(treenode.parent)
	{
		this.addnode();
		var itr = treenode.parent.children.begin();
		for(;itr.val != treenode;itr=itr.next){} //finds where to add new cuts
		//add doublecut
		var p = itr.val.addChild(treenode.shape.attrs.x + (treenode.shape.attrs.width/2), treenode.shape.attrs.y + (treenode.shape.attrs.height/2));
		p = p.addChild(treenode.shape.attrs.x + (treenode.shape.attrs.width/2), treenode.shape.attrs.y + (treenode.shape.attrs.height/2));
		//changes parent
		treenode.parent = p;
		//if cut puts in children list
		p.children.push_back(treenode);
		//expands the doublecut
		p.expand(treenode.shape.attrs.x,treenode.shape.attrs.y,treenode.shape.attrs.width,treenode.shape.attrs.height);
	}
}

Proof.prototype.r_double_cut = function (treenode)
{
	
	if(treenode.parent && !treenode.variables.length && treenode.children.length == 1)
	{
		this.addnode();
		var p = treenode.children.begin().val;
		//change parent pointers
		var itr = p.children.begin();
		for(;itr != p.children.end();itr = itr.next)
		{
			itr.val.parent = treenode.parent;
		}
		for(itr = p.variables.begin(); itr != p.variables.end(); itr = itr.next)
		{
			itr.val.parent = treenode.parent;
		}
		//append lists
		treenode.parent.children.append(p.children);
		treenode.parent.variables.append(p.variables);
		//remove doublecut
		for(itr = treenode.parent.children.begin();itr.val != treenode;itr = itr.next) {}
		treenode.parent.children.erase(itr);
		treenode.shape.remove();
		treenode.children.begin().val.shape.remove();
		treenode.parent.contract();
	}
}
Proof.prototype.insertion = function(treenode,plane)//merges plane at the location of treenode
{
	if(treenode.getLevel() % 2)//checks for odd level
	{
		this.addnode();
		for(var itr = plane.children.begin(); itr != plane.children.end();itr = itr.next)
		{
			itr.val.parent = treenode;
			//make sure that coordinates changed for full proof
			treenode.expand(itr.val.shape.attrs.x,itr.val.shape.attrs.y,itr.val.shape.attrs.width,itr.val.shape.attrs.height);
		}
		treenode.children.append(plane.children);
		for(var itr = plane.variables.begin(); itr != plane.variables.end();itr = itr.next)
		{
			itr.val.parent = treenode;
			//make sure that coordinates changed for full proof
			//may need to expand treenode
		}
		treenode.variables.append(plane.variables);
	}
}
Proof.prototype.erasure = function (treenode)//treenode is object to erase
{
	if(treenode.getLevel() % 2)
	{
		this.addnode();
		if(treenode instanceof Variable)
		{
			var itr = treenode.parent.variables.begin();
			for(;itr.val != treenode;itr = itr.next) {}
			treenode.parent.variables.erase(itr);
			treenode.text.remove();
		}else{
			var itr = treenode.parent.children.begin();
			for(;itr.val != treenode;itr = itr.next) {}
			treenode.parent.children.erase(itr);
			treenode.deleteTree();
			treenode.parent.contract();
		}
	}
}
//temp func for testing
Proof.prototype.insertion_cut = function(treenode,x,y)
{
	treenode.addChild(x,y);
}

Proof.prototype.insertion_variable = function(treenode,x,y)
{
	treenode.addVariable(x,y);
}