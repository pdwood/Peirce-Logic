function ProofNode(p) {
	this.plane = null;
	this.next = null;
	this.prev = null;
	this.proof = p;
	this.id = 1;
	this.name = 'undefined';
	this.isPremise = false;
}

function Proof(R) {
	this.paper = R;
	this.current = new ProofNode(this);//current node displayed
	this.current.plane = new Level(R,null);
	this.front = this.current;
	this.back = this.current;
	this.current.name = 'Premise Start';
}


//adds a node in the proof, must be called by all inference rules before tree is changed
//all nodes after current will be removed
Proof.prototype.addnode = function () {
	this.current.next = new ProofNode(this);
	this.current.next.prev = this.current;
	this.current.next.plane = this.current.plane;
	this.current.plane = this.current.plane.duplicate();
	this.current = this.current.next;
	this.current.id = this.current.prev.id + 1;
	this.back = this.current;
	timeline_f.draw.call(Timeline, {proof:this});
}

//moves proof to last step
Proof.prototype.prev = function() {
	if(this.current.prev) {
		this.current.plane.compressTree();
		this.current = this.current.prev;
		this.current.plane.restoreTree();
	}
}

//selects step from timeline
Proof.prototype.select = function(node) {
	if(this.current != node) {
		this.current.plane.compressTree();
		this.current = node;
		this.current.plane.restoreTree();
	}
}

//moves proof to next step
Proof.prototype.next = function () {
	if(this.current.next) {
		this.current.plane.compressTree();
		this.current = this.current.next;
		this.current.plane.restoreTree();
	}
}
//swaps proof to the step pointed to by proof node
Proof.prototype.swap = function (proof_node) {
	if(proof_node) {
		this.current.plane.compressTree();
		this.current = proof_node;
		this.current.plane.restoreTree();
	}
}

//////////////////////////////////
//Inference Rules
//////////////////////////////////

//creates a empty doublecut at x,y
Proof.prototype.empty_double_cut = function (treenode, x, y) {
	this.addnode();
	var p = treenode.addChild(x,y);
	p.addChild(x,y);
	this.current.name = 'Empty Double Cut';
}
//creates a doublecut around treenode(cut) variables to be added later
Proof.prototype.double_cut = function (treenode) {
	if(treenode.parent)	{
		this.addnode();
		var parent_list = 0;
		if(treenode instanceof Level) {
			parent_list = treenode.parent.subtrees; 
		}
		else {
			parent_list = treenode.parent.leaves; 
		}		
		var itr = parent_list.begin();
		for(;itr.val != parent_list.end();itr=itr.next) {
			if(itr.val.id == treenode.id) break;
		} 
		parent_list.erase(itr);
		//add doublecut
		if(treenode instanceof Level) { 
			r_attrs = treenode.shape.getBBox();
			var p = treenode.parent.addChild(r_attrs.x + (r_attrs.width/2), r_attrs.y + (r_attrs.height/2));
			p = p.addChild(r_attrs.x + (r_attrs.width/2), r_attrs.y + (r_attrs.height/2));
			//changes parent
			treenode.parent = p;
			treenode.id = p.getNewID();
			//if cut puts in children list
			p.subtrees.push_back(treenode);
			treenode.updateLevel(); 
			//expands the doublecut
			p.expand(r_attrs.x,r_attrs.y,r_attrs.width,r_attrs.height);
			//move collided nodes out of way
			p.shiftAdjacent(treenode,treenode.shape.getBBox());
			p.contract();
		}
		else if(treenode instanceof Variable) { 
			r_attrs = treenode.text.attrs;
			var p = treenode.parent.addChild(r_attrs.x , r_attrs.y);
			p = p.addChild(r_attrs.x, r_attrs.y);
			//changes parent
			treenode.parent = p;
			treenode.id = p.getNewID();
			//if cut puts in variable list
			p.leaves.push_back(treenode);
			treenode.updateLevel(); 
			//expands the doublecut
			p.expand(treenode.text.getBBox().x,treenode.text.getBBox().y,treenode.text.getBBox().width,treenode.text.getBBox().height);
			//move collided nodes out of way
			p.shiftAdjacent(treenode,treenode.text.getBBox());
			p.contract();
		}
	}
	this.current.name = 'Double Cut';
}

Proof.prototype.r_double_cut = function (treenode) {
	if(treenode.parent.parent && (
		(!treenode.parent.subtrees.length && treenode instanceof Variable) || 
		(!treenode.parent.leaves.length && treenode.parent.subtrees.length == 1)))
	{
		tparent = treenode.parent;
		if(tparent.parent.parent && !tparent.parent.leaves.length && tparent.parent.subtrees.length == 1)
		{
			this.addnode();
			tgrandparent = tparent.parent;
			
			//changes parent
			treenode.parent = tgrandparent.parent;
			
			//erase cuts
			var parent_list = 0;
			if(treenode instanceof Level) {
				parent_list = tparent.subtrees; }
			else {
				parent_list = tparent.leaves; }	
			var itr = parent_list.begin();
			for(;itr.val != parent_list.end();itr=itr.next){
				if(itr.val.id == treenode.id) break;
			} 
			parent_list.erase(itr);
			
			var itr = tgrandparent.subtrees.begin();
			for(;itr.val != tgrandparent.subtrees.end();itr=itr.next){
				if(itr.val.id == tparent.id) break;
				//loop here for future use with multi nodes
			} 
			itr.val.compress();
			tgrandparent.subtrees.erase(itr);
			
			var itr = tgrandparent.parent.subtrees.begin();
			for(;itr.val != tgrandparent.parent.subtrees.end();itr=itr.next){
				if(itr.val.id == tgrandparent.id) break;
				//loop here for future use with multi nodes
			} 
			itr.val.compress();
			tgrandparent.parent.subtrees.erase(itr);
			
			//gets new id
			treenode.id = tgrandparent.parent.getNewID();
			p = tgrandparent.parent;
			if(treenode instanceof Level) { 
				r_attrs = treenode.shape.getBBox();
				//if cut puts in children list
				p.subtrees.push_back(treenode);
				treenode.updateLevel(); 
				//expands the doublecut
				p.expand(r_attrs.x,r_attrs.y,r_attrs.width,r_attrs.height);
				//move collided nodes out of way
				p.shiftAdjacent(treenode,treenode.shape.getBBox());
				p.contract();
			}
			else if(treenode instanceof Variable) { 
				r_attrs = treenode.text.attrs;
				//changes parent
				treenode.parent = p;
				treenode.id = p.getNewID();
				//if cut puts in variable list
				p.leaves.push_back(treenode);
				treenode.updateLevel(); 
				//expands the doublecut
				p.expand(treenode.text.getBBox().x,treenode.text.getBBox().y,treenode.text.getBBox().width,treenode.text.getBBox().height);
				//move collided nodes out of way
				p.shiftAdjacent(treenode,treenode.text.getBBox());
				p.contract();
			}
		}
	}
	this.current.name = 'Reverse Double Cut';
}

//merges plane at the location of treenode
Proof.prototype.insertion = function(treenode,plane) {
	if(!(treenode.getLevel() % 2)) {//checks for odd level
		this.addnode();
		for(var itr = plane.subtrees.begin(); itr != plane.subtrees.end();itr = itr.next) {
			itr.val.parent = treenode;
			//make sure that coordinates changed for full proof
			treenode.expand(itr.val.shape.attrs.x,itr.val.shape.attrs.y,itr.val.shape.attrs.width,itr.val.shape.attrs.height);
		}
		treenode.subtrees.append(plane.subtrees);
		for(var itr = plane.leaves.begin(); itr != plane.leaves.end();itr = itr.next) {
			itr.val.parent = treenode;
			//make sure that coordinates changed for full proof
			//may need to expand treenode
		}
		treenode.leaves.append(plane.leaves);
	}
		this.current.name = 'Insertion';
}

//treenode is object to erase
Proof.prototype.erasure = function (treenode) {
	if(treenode.getLevel() % 2) {
		this.addnode();
		var parent_list = 0;
		if(treenode instanceof Level) {
			parent_list = treenode.parent.subtrees; 
		}
		else {
			parent_list = treenode.parent.leaves; 
		}	
			
		var itr = parent_list.begin();
		for(;itr.val != parent_list.end();itr=itr.next) {
			if(itr.val.id == treenode.id) break;
		} 
		if(treenode instanceof Level) {
			itr.val.compressTree();
		}
		else {
			itr.val.compress();
		}
		parent_list.erase(itr);
	}
	this.current.name = 'Erasure';
}

//temp funcs for testing
Proof.prototype.premise_insertion_cut = function(treenode,x,y) {
	this.addnode();
	treenode.addChild(x,y);
	this.current.name = 'Premise Insertion';
}

Proof.prototype.premise_insertion_variable = function(treenode,x,y) {
	this.addnode();
	treenode.addVariable(x,y);
	this.current.name = 'Premise Insertion';
}