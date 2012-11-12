InferenceRule.prototype.erasure = function (proof, rule_name, nodes) {
	proof.addnode(rule_name,this.RuleToId(rule_name));
	nodes.iterate(function(node) {
		var parent_list = null;
		if(node instanceof Level) {
			parent_list = node.parent.subtrees; 
		}
		else {
			parent_list = node.parent.leaves; 
		}	
			
		var itr = parent_list.skipUntil(function(x) { 
			return (x === node);
		});

		if(node instanceof Level) {
			itr.val.compressTree();
		}
		else {
			itr.val.compress();
		}
		parent_list.erase(itr);
	});
};

InferenceRule.prototype.premise_erasure = function (mode) {
	return function(inf){
	return function(proof, nodes) {
		inf.erasure(proof, mode, nodes);
	};
	}(this);
};
