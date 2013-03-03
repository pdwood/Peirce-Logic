/*Level.prototype.equivalence = function(other){
	// get leaves of both trees
	var L1 = tree_leaves(this);
	var L2 = tree_leaves(other);
	// check of same leaf count
	if (L1.length !== L2.length)
		return false;
	// simple case of two empty cuts
	if (L1.length === L2.length && L1.length===0)
		return true;
	// run treeisomorphism
	return tree_isomorphic(L1,L2,0);
};
*/

Node.prototype.empty = function(){
	if(this.subtrees.length !== 0){return false;}
	if(this.leaves.length !== 0){return false;}
	return true;
}

/*
remove_node(array, index){
	var ret = array[index];
	array[index] = array[array.length-1];
	array.pop();
	return ret;
}*/

//checks if node is a model
Node.prototype.is_model = function(){
	//checks that all cuts contain only one atomic sentence
	for(var i=0; i<this.subtrees.length; i++){
		if(this.subtrees[i].subtrees.length > 0 || this.subtrees[i].leaves.length !== 1){return false;}
	}
	return true;
}

//checks if node is the disjunction of models
Node.prototype.model_disjunct = function(){
	if(this.leaves.length !== 0){return false;}
	for(var i=0; i<this.subtrees.length; i++){	
		if(!this.subtrees[i].is_model()){return false;}
	}
	return true;
}


//adds a literal to the current node.
Node.prototype.add_lit = function(literal,truth){
	if(truth){
		this.leaves.push(literal);
	}
	else{
		var new_node = Node.NodeSkeleton(this);
		this.subtrees.push(new_node);
		new_node.leaves.push(literal);
	}
}

//Paste_routine
//literal lists a variable
//truth - bool value to tell if variable is true or false
Node.prototype.paste =  function(literal, truth){
	document.write("paste", literal, " ", truth);
	this.print_node();
	document.write("|");
	if(this.subtrees.length === 1 && this.subtrees[0].empty() && this.leaves.length === 0){return;} //if empty cut
	if(this.is_model()){this.add_lit(literal, truth);} //if model
	else{ //disjunction of models
		var n = this.subtrees[0];
		if(!n.model_disjunct()){
			n.DN_leaves();
			//document.write("error: not the disjunction of models");
			//document.write("testing disjunct ", n.model_disjunct());
		}
		for(var i=0; i < n.subtrees.length; i++){
			n.subtrees[i].add_lit(literal, truth);
		}
	}
}

Node.prototype.remove_lit = function(lit, truth){
	for(var i=0; i<this.leaves.length; i++){
		if(this.leaves[i]==lit){
			this.leaves[i] = this.leaves[this.leaves.length-1];
			this.leaves.pop(); i--;
			if(!truth){
				this.subtrees.push(Node.NodeSkeleton(this));				
			}
		}
	}
	for(var i=0; i<this.subtrees.length; i++){
		if(!truth && this.subtrees[i].subtrees.length===0 && 
			this.leaves[0]===lit && this.leaves.length===1){
			this.subtrees[i] = this.subtrees[this.subtrees.length-1];
			this.subtrees.pop(); i--;
		}
		else{
			this.subtrees[i].remove_lit(lit);
		}
	}
}

Node.prototype.print_node = function(){
	for(var i=0; i<this.leaves.length; i++){
		document.write(this.leaves[i], " ");
	}
	for(var i=0; i<this.subtrees.length; i++){
		document.write(" ( ");
		this.subtrees[i].print_node();
		document.write(") ");
	}
	//document.write("|","\n");
}

//duplicates node
Node.prototype.duplicate = function() {
	var dup = Node.NodeSkeleton(this.parent);
	for(var i=0; i<this.leaves.length; i++){
		dup.leaves.push(this.leaves[i]);
	}
	for(var i=0; i<this.subtrees.length; i++){
		var child_dup = this.subtrees[i].duplicate();
		child_dup.parent = dup;
		dup.subtrees.push(child_dup);
	}
	return dup;
}


//Transforms node into Disjunctive Normal Form
Node.prototype.DNFTransform = function(){
	this.remove_DN();
	document.write("DNF:")
	this.print_node(); document.write("|"); 
	if(this.subtrees.length === 1 && this.subtrees[0].empty()){return;} //if empty cut
	if(this.empty()){return;} //if empty graph

	//checks for at least one literal at depth 0 and removes it
	var lit; var truth; var has_lit = false;
	if(this.leaves.length !== 0){ 
		has_lit = true;
		lit = this.leaves[this.leaves.length-1];
		this.leaves.pop();
		truth = true;	
	}
	else{ 
		var lit_ind = 0;
		while(lit_ind !== this.subtrees.length){
			if(this.subtrees[lit_ind].subtrees.length ===0 &&
				this.subtrees[lit_ind].leaves.length === 1)
				{break;}
			lit_ind++;
		}
		if(lit_ind !== this.subtrees.length){
			has_lit = true;
			lit = this.subtrees[lit_ind].leaves[0];
			this.subtrees[lit_ind] = this.subtrees[this.subtrees.length-1]; //NEED TO DUPLICATE????
			this.subtrees.pop();
			truth = false;
		}		
	}
	if(has_lit){
		this.remove_lit(lit, truth); 
		this.DNFTransform();
		this.paste(lit, truth);
		this.remove_DN();
		return;
	}
	else if(this.subtrees.length === 1){return;}
	else{//step three in transformation
		//treats all leaves as a single subgraph

		//can we assume there will be a subtree?
		var G1 = this.subtrees[this.subtrees.length-1].duplicate();
		this.subtrees.pop(); //sets this to G2

		var G2 = this.duplicate();

		//var new_graph = Node.NodeSkeleton(this.parent);
		this.subtrees = []; this.leaves = []
		this.subtrees.push(Node.NodeSkeleton(this));

		//handles each cut as a subgraph
		for(var i=0; i<G1.subtrees.length; i++){
			var G3 = Node.NodeSkeleton(this.subtrees[0]);
			this.subtrees[0].subtrees.push(G3)
			G3.absorb_graph(G2);
			var G4 = Node.NodeSkeleton(G3);
			G4.subtrees.push(G1.subtrees[i].duplicate());////var G4 = G1.subtrees[i].duplicate();
			G3.subtrees.push(G4);
			G3.DNFTransform();
		}

		//handles conjunction of leaves as a subgraph
		var LeafG3 = Node.NodeSkeleton(this.subtrees[0]);
		var LeafG4 = Node.NodeSkeleton(LeafG3);
		LeafG3.subtrees.push(LeafG4);
		for(var i=0; i<G1.leaves.length; i++){
			LeafG4.leaves.push(G1.leaves[i]);
		}
		LeafG3.absorb_graph(G2);
		LeafG3.DNFTransform();
		this.subtrees[0].subtrees.push(LeafG3);
		this.subtrees[0].remove_DN();
		this.remove_DN();
	}

};

//Copies G and adds it to current node
Node.prototype.absorb_graph = function(G){
	for(var i=0; i<G.subtrees.length; i++){
		var new_sub = G.subtrees[i].duplicate();
		new_sub.parent = this;
		this.subtrees.push(new_sub);
	}
	for(var i=0; i<G.leaves.length; i++){
		this.leaves.push(G.leaves[i]);
	}
}


//removes all Double negations from subgraphs
Node.prototype.remove_DN = function(){
	for(var i=0; i<this.subtrees.length; i++){
		if(this.subtrees[i].leaves.length === 0 && this.subtrees[i].subtrees.length === 1){
			this.absorb_graph(this.subtrees[i].subtrees[0]);
			this.subtrees[i] = this.subtrees[this.subtrees.length-1];
			this.subtrees.pop();
			i--; //repeats test on new subtrees[i];
		}
	}
}

//Wraps double negation around each leaf
Node.prototype.DN_leaves = function(){
	for(var i=0; i<this.leaves.length; i++){
		this.subtrees.push(Node.NodeSkeleton());
		this.subtrees[this.subtrees.length-1].add_lit(this.leaves[i],false);
	}
	this.leaves = [];
}

//returns a new NodeSkeleton (uses arrays instead of lists)
Node.NodeSkeleton = function(parent){
	var new_node = new Node(parent);
	new_node.subtrees = [];
	new_node.leaves = [];
	return new_node;
}

//
Node.node_to_node_skeleton = function(node){
	var node_skeleton = Node.NodeSkeleton();
	//node_skeleton.subtrees = [];
	node.subtrees.iterate(function(s) {
		var node_subtree = Node.node_to_node_skeleton(s);
		node_subtree.parent = node_skeleton;
		node_skeleton.subtrees.push(node_subtree);
	});
	//node_skeleton.leaves = [];
	node.leaves.iterate(function(s){
		node_skeleton.leaves.push(s.text);
	})
	return node_skeleton;
}