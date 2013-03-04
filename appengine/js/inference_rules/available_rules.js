InferenceRule.prototype.AvailableRules = function(proof,nodes) {
	var logic_modes = proof.LOGIC_MODES;
	var current_mode = proof.CURRENT_MODE;
	var methods = {} ;

	//properties of node set
	var all_even_level = true;
	var all_odd_level = true;
	var all_same_parent = true;
	var all_have_parent = true;
	var iterable = false;
	var deiterable = false;
	var level = null;
	var parent = null;
	var iteration_nodes = null;
	nodes.iterate(function(node) {
		if(!level) {
			level = (node.getLevel())%2;
			if(level) {
				all_even_level = false;
			}
			else
				all_odd_level = false;
		}
		else if((node.getLevel())%2!=level){
			all_even_level = false;
			all_odd_level = false;
		}
		if(!parent) {
			parent = node.parent;
		}
		else if (!(node.parent === parent)) {
			all_same_parent = false;
		}
		if(!parent) all_have_parent = false;
	});
	if (nodes.length==2){
		var node1 = nodes.begin().val;
		var node2 = nodes.begin().next.val;
		var node_source;
		var node_dest;
		if(node1.getLevel() > node2.getLevel()) {
			node_source = node2;
			node_dest = node1;
		}
		else {
			node_source = node1;
			node_dest = node2;
		}
		if (node_dest instanceof Level ||
			(node_dest instanceof Variable && node_source instanceof Variable)) {
			var main_parent = node_source.parent;
			var ancestor = node_dest.parent;
			var share_ancestor = false;
			while(ancestor!==null) {
				if(main_parent === ancestor) {
					share_ancestor = true;
					break;
				}
				ancestor = ancestor.parent;
			}
			if(share_ancestor) {
				if(node_dest instanceof Level)
					iterable = true;
				iteration_nodes = new List();
				iteration_nodes.push_back(node_source);
				iteration_nodes.push_back(node_dest);
				if(node_source instanceof Variable && node_dest instanceof Variable) {
					if (node_source.getName() === node_dest.getName()) {
						deiterable = true;
					}
					else {
						deiterable = false;
					}
				}
				else if (!(node_source instanceof Variable || node_dest instanceof Variable)) {
					if (node_source.equivalence(node_dest)) {
						deiterable = true;
					}
					else {
						deiterable = false;
					}
				}
				else {
					deiterable = false;
				}
			}
		}
	}


	if(current_mode === logic_modes.PREMISE_MODE || current_mode === logic_modes.INSERTION_MOD
		|| current_mode === logic_modes.GOAL_MODE) {
		var mode_name = 'Construction: ';
		var out_of_plane = false;
		var in_orig_set = false;
		var ok_in_orig_set = null;
		var contains_insertion_plane = false;
		if(current_mode === logic_modes.INSERTION_MODE) {
			var nMH = this.MH;
			if(iterable) {
				// add source node in ok set
				ok_in_orig_set = iteration_nodes.begin().val;
			}
			nodes.iterate(function(node) {
				if(node === nMH.thunk.data.Node)
					contains_insertion_plane = true;
					return;
				if((nMH.thunk.data.OriginalSubtrees.contains(node)
					|| nMH.thunk.data.OriginalLeaves.contains(node))
					&& node !== ok_in_orig_set)
					in_orig_set = true;

				var p = node.parent;
				while(p!==null) {
					if(p===nMH.thunk.data.Node)
						return;
					if((nMH.thunk.data.OriginalSubtrees.contains(p)
						|| nMH.thunk.data.OriginalLeaves.contains(p))
						&& p !== ok_in_orig_set)
						in_orig_set = true;
					p = p.parent;
				}
				out_of_plane = true;
			});


		}
		if(!out_of_plane && !in_orig_set) {
			if(nodes.length==1) {
				node = nodes.begin().val;
				if(node instanceof Level) {
					var name = mode_name+'Variable';
					methods[name] = this.variable_for(name);
					var name = mode_name+'Empty Cut';
					methods[name] = this.empty_n_cut_for(1,name);
					var name = mode_name+'Empty Double Cut';
					methods[name] = this.empty_n_cut_for(2,name);
				}
			}
			else if (nodes.length==2 && iteration_nodes && !contains_insertion_plane) {
				if(iterable) {
					var name = mode_name+'Iteration';
					methods[name] = this.iteration_for(iteration_nodes,name);
				}
				if(deiterable) {
					var name = mode_name+'Deiteration';
					methods[name] = this.deiteration_for(iteration_nodes,name);
				}
			}
			if(all_same_parent && all_have_parent && !ok_in_orig_set && !contains_insertion_plane) {
				var name = mode_name+'Cut';
				methods[name] = this.n_cut_for(1,name);
				var name = mode_name+'Double Cut';
				methods[name] = this.n_cut_for(2,name);
				if(this.validate_reverse_n_cut(1,nodes)) {
					var name = mode_name+'Reverse Cut';
					methods[name] = this.reverse_n_cut_for(1,name);
				}
				if(this.validate_reverse_n_cut(2,nodes)) {
					var name = mode_name+'Reverse Double Cut';
					methods[name] = this.reverse_n_cut_for(2,name);
				}
			}
			if(all_have_parent && !ok_in_orig_set && !contains_insertion_plane) {
				var name = mode_name+'Erasure';
				methods[name] = this.erasure_for(name);
			}
		}
	}


	if(current_mode == logic_modes.PROOF_MODE) {
		var mode_name = 'Proof: ';
		if(nodes.length==1) {
			node = nodes.begin().val;
			if(node instanceof Level) {
				var name = mode_name+'Empty Double Cut';
				methods[name] = this.empty_n_cut_for(2,name);
			}
		}
		if(all_same_parent && all_have_parent) {
			var name = mode_name+'Double Cut';
			methods[name] = this.n_cut_for(2,name);
			if(this.validate_reverse_n_cut(2,nodes)) {
				var name = mode_name+'Reverse Double Cut';
				methods[name] = this.reverse_n_cut_for(2,name);
			}
		}
		if (nodes.length==2 && iteration_nodes) {
			if(iterable) {
				var name = mode_name+'Iteration';
				methods[name] = this.iteration_for(iteration_nodes,name);
			}
			if(deiterable) {
				var name = mode_name+'Deiteration';
				methods[name] = this.deiteration_for(iteration_nodes,name);
			}
		}
		if(nodes.length==1) {
			node = nodes.begin().val;
			if(all_even_level && node instanceof Level) {
				var name = mode_name+'Insertion';
				methods[name] = this.insertion_for(name);
			}
		}
		if(all_even_level && all_have_parent) {
			var name = mode_name+'Erasure';
			methods[name] = this.erasure_for(name);
		}
	}
	return methods;
};
