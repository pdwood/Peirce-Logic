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
//adds a node in the proof, must be called by all inference rules before tree is changed
Proof.prototype.addnode = function () //all nodes after current will be removed
{
	this.current.next = new ProofNode(this);
	this.current.next.prev = this.current;
	this.current.next.plane = this.current.plane;
	//this.current.plane = jQuery.extend(true, {}, this.current.plane);//dont think this copys the whole tree(according to the documentation i found, it would only copy the root)
	this.current.plane = this.current.duplicate();//not yet implemented, should duplicate the tree in current
	this.current = this.current.next;
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
		for(itr = p.variables; itr != p.variables.end(); itr = itr.next)
		{
			itr.val.parent = treenode.parent;
		}
		//append lists
		treenode.parent.children.append(p.children);
		treenode.parent.variables.append(p.variables);
		//remove doublecut
		for(itr = treenode.parent.children.begin();itr.val != treenode;itr = itr.next) {}
		treenode.parent.children.erase(itr);
		treenode.parent.contract();
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