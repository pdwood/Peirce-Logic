proofToString = function() {
	var someJson = {
		"this":"is",
 	 "some":"fake",
 	 "js-n":{
			"string":"that",
			"bharath":"told"
 	 },
		"me":"tomake"
  };
	return JSON.stringify(someJson);
}

stringToProof = function(proofString) {
	// load the proof from some string
	return
}

fillSaveString = function() {
	$("#content").val(proofToString());                                               
}
// on click
$("#saveButton").click(fillSaveString())

// THIS IS THE OLD CODE
// I LEFT IT HERE BECUZ mAYbe IT"S USEFUL 2 u
//
//
//function save_proof(proof){
//    var proof_json = {};
//    proof_json["proof"] = proofnode_to_json(proof.front);
//    return proof_json;
//}
//
//function proofnode_to_json(proofnode) {
//    var proofnode_json = {};
//    proofnode_json["id"] = proofnode.id;
//    proofnode_json["id_gen"] = proofnode.id_gen;
//    proofnode_json["rule_name"] = proofnode.rule_name;
//    proofnode_json["rule_id"] = proofnode.rule_id;
//    proofnode_json["mode"] = proofnode.mode;
//    proofnode_json["thunk"] = proofnode.thunk;
//    proofnode_json["plane"] = plane_to_json(proofnode.plane);
//    proofnode_json["next"] = [];
//    proofnode.next.iterate(function (pn) {
//        proofnode_json["next"].push(proofnode_to_json(pn));
//    });
//    return proofnode_json;
//}
//
//function plane_to_json(node){
//    var node_json = {};
//    node_json["id"] = node.id;
//    node_json["id_gen"] = node.id_gen;
//    if(node.shape)
//        node_json["point"] = [node.shape.attr("x"),node.shape.attr("y")];
//    else
//        node_json["point"] = [node.saved_attr["x"],node.saved_attr["y"]];
//    node_json["leaves"] = [];
//    node.leaves.iterate(function (nc) {
//        if(node.shape)
//            node_json["leaves"].push({"text":nc.text.attr("text"),
//                                      "point": [nc.text.attr("x"),nc.text.attr("y")]});
//        else
//            node_json["leaves"].push({"text":nc.text.attr("text"),
//                                      "point": [nc.saved_attr["x"],nc.saved_attr["y"]]});
//    });
//    node_json["subtrees"] = [];
//    node.subtrees.iterate(function (ns) {
//        node_json["subtrees"].push(plane_to_json(ns));
//    });
//    return node_json;
//}
