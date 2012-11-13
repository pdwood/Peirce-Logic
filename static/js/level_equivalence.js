// Level.prototype.equivalence = function(other) {

// }

// var canonical_degree_spectrum = function(root,leaf_map) {

// }

// var make_leaf_map = function(forest) {
// 	return leaf_map(forest,{},2)
// }

// var leaf_map = function(forest,leaf_map,var_id) {
// 	root = tree;

// 	for(var tree = forest.begin(); tree != forest.end(); tree = tree.next) {

// 		for(var itr = tree.leaves.begin(); itr != tree.leaves.end();itr = itr.next) {
// 			var var_name = itr.val.text.attr('text');
// 			if(!(var_name in leaf_map)) {
// 				leaf_map[var_name] = var_id;
// 				var_id++;
// 			}
// 		}
// 		for(var itr = tree.leaves.begin(); itr != tree.leaves.end();itr = itr.next) {
// 			var var_name = itr.val.text.attr('text');
// 			if(!(var_name in leaf_map)) {
// 				leaf_map[var_name] = var_id;
// 				var_id++;
// 			}
// 		}
// 	}
// }