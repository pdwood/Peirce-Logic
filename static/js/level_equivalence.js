Level.prototype.equivalence = function(other) {
	var L1 = level_leaves(this);
	var L2 = level_leaves(other);
	if (L1.length !== L2.length)
		return false;
	canonical_names = canonical_names(this,L1,other,L2,0);
	return canonical_names[0]==canonical_names[1];
};

function tree_isomorphic(L1,L2,level) {
	if(level+1!==L1.length) {
		if (!tree_isomorphic(L1,L2,level+1)) {
			return false;
		}
	}
	N1 = level_names(L1[level]);
	N2 = level_names(L2[level]);
	N1[0].sort();
	N2[0].sort();
	if (arrays_equal(N1[0],N2[0])) {
		if (level!==0) {
			L1[level-1].concate(leaf_name_alias(N1[1],N1[2]));
			L2[level-1].concate(leaf_name_alias(N2[1],N2[2]));
		}
		return true;
	}
	return false;
}

function leaf_name_alias (names,leaves_parents) {
	var alias_leaves = [];
	var alias_map = {};
	var alias_counter = 1;
	for(var i in N1) {
		if (N1[i] in alias_map) {
			alias_leaves.push( alias_map[N[i]] );
		}
		else {
			alias_map[ N1[i] ] = [leaves_parents[ N1[i] ], alias_counter++ ];
		}
	}
}

function level_subtrees (leaves_map) {
	degree_spectrum = {};
	for (var n in leaves_map) {
		if (n[0] in degree_spectrum) {
			degree_spectrum[n[0]].push(n[1]);
		}
		else {
			degree_spectrum[n[0]] = [n[1]];
		}
	}
	names = [];
	subtrees_spectrum = {};
	for (var d in degree_spectrum) {
		var sorted_spectrum = degree_spectrum[d].sort();
		names.push(sorted_spectrum);
		if (!(sorted_spectrum in subtrees_spectrum)) {
			subtrees_spectrum[sorted_spectrum] = d;
		}
	}
	return [names,subtrees_spectrum];
}

function level_leaves(root) {
	var levels = [];
	var frontier = new List();
	var level = 1;

	frontier.push_back(root);
	frontier.push_back(level);
	while(frontier.length && !(typeof(frontier.begin().val)!=='number' && frontier.length===1)) {
		leaves = [];

		while(typeof(frontier.begin().val)!=='number') {
			var node = frontier.pop_front();

			node.subtrees.iterate(function(c) {
				if(!(c.subtrees.length || c.leaves.length)) {
					leaves.push([c.parent,0]);
				}
				else {
					frontier.push_back(c);
				}
			});

			node.leaves.iterate(function(v) {
				leaves.push([v.parent,v.getName()]);
			});
		}
		levels.push(leaves);

		frontier.pop_front();
		frontier.push_back(++level);
	}
	return levels;
};
