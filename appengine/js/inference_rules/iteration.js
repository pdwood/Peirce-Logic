InferenceRule.prototype.iteration = function (proof, rule_name, nodes, x, y) {
	proof.addnode(rule_name,this.RuleToId(rule_name),nodes);
	var source = nodes.begin().val.duplicate();
	var dest = nodes.begin().next.val;
	source.parent = dest;
	var dx = x-source.saved_attr.x;
	var dy = y-source.saved_attr.y;
	if (source instanceof Level) {
		dest.subtrees.push_back(source);
		source.restoreTree();
	}
	else {
		dest.leaves.push_back(source);
		source.restore();
	}
	source.drag(dx,dy);
	source.updateLevel();



	if(dest instanceof Level) {
		var bbox;
		if (source instanceof Level) {
			bbox = source.shape.getBBox();
		}
		else {
			bbox = source.text.getBBox();
		}
		//expands the dest cut
		dest.expand(bbox.x,bbox.y,bbox.width,bbox.height,true);
		//move collided nodes out of way
		dest.shiftAdjacent(source,bbox);
		dest.contract();
	}
};

InferenceRule.prototype.iteration_for = function (iteration_nodes,mode) {
	return function(inf){
	return function(proof, nodes, x, y) {
		inf.iteration(proof, mode, iteration_nodes, x, y);
	};
	}(this);
};

InferenceRule.prototype.deiteration = function (proof, rule_name, nodes) {
	proof.addnode(rule_name,this.RuleToId(rule_name),nodes);
	var dest = nodes.begin().next.val;
	var parent = dest.parent;
	parent.removeNode(dest);
};

InferenceRule.prototype.deiteration_for = function (iteration_nodes,mode) {
	return function(inf){
	return function(proof, nodes) {
		inf.deiteration(proof, mode, iteration_nodes);
	};
	}(this);
};
