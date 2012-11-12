InferenceRule.prototype.AvailableRules = function(proof,nodes,logic_modes,current_mode) {
	var methods = {} ;

	//proerties of node set
	var all_even_level = true;
	var all_odd_level = true;
	var all_same_parent = true;
	var all_have_parent = true;
	var one_node = (nodes.length==1);
	var level = null;
	var parent = null;
	nodes.iterate(function(node) {
		if(!level) {
			level = node.getLevel()%2;
			if(level) {
				all_even_level = false;
			}
			else 
				all_odd_level = false;
		}
		else if(node.getLevel()%2!=level){
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

	if(current_mode == logic_modes.PREMISE_MODE) {
		if(one_node) {
			node = nodes.begin().val;
			if(node instanceof Level) {
				methods['Construction: Variable'] = this.variable_for('Construction: Variable');
				methods['Construction: Empty Cut'] = this.empty_n_cut_for(1,'Construction: Empty Cut');
				methods['Construction: Empty Double Cut'] = this.empty_n_cut_for(2,'Construction: Empty Double Cut');
			}
		}
		if(all_same_parent) {
			methods['Construction: Cut'] = this.n_cut_for(1,'Construction: Cut');
			methods['Construction: Double Cut'] = this.n_cut_for(2,'Construction: Double Cut');
			if(this.validate_reverse_n_cut(1,nodes))
				methods['Construction: Reverse Cut'] = this.reverse_n_cut_for(1,'Construction: Reverse Cut');
			if(this.validate_reverse_n_cut(2,nodes))
				methods['Construction: Reverse Double Cut'] = this.reverse_n_cut_for(2,'Construction: Reverse Double Cut');
		}
		if(all_have_parent)
			methods['Construction: Erasure'] = this.premise_erasure['Construction: Erasure'];
	}
	if(current_mode == logic_modes.PROOF_MODE) {
		if(nodes instanceof Level) {
			if(nodes.getLevel() % 2) { //odd level

			}
			else {

			}
		}
		else if(nodes instanceof Variable) {
			if(nodes.getLevel() % 2) { //odd level

			}
			else {

			}
		}
	}
	return methods;
};
