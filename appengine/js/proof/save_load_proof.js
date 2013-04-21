function save_proof(proof){
    var proof_json = [];
    var current_proof_node = proof.front;
    do{
        proof_node_json = {}
        proof_node_json["id"] = current_proof_node.id;
        proof_node_json["id_gen"] = current_proof_node.id_gen;
        proof_node_json["rule_name"] = current_proof_node.rule_name;
        proof_node_json["rule_id"] = current_proof_node.rule_id;
        proof_node_json["rule_id"] = current_proof_node.rule_id;
        proof_node_json["mode"] = current_proof_node.mode;
        returnXML += "<id>"+current_node.id+"</id>";
        returnXML += "<name>"+current_node.name+"</name>";
        returnXML += "<is_premise>"+current_node.isPremise+"</is_premise>";
        current_plane = current_node.plane.duplicate();
        returnXML += "<level_data>";

        returnXML += print_level_tree(current_plane);

        returnXML += "</level_data>";
        returnXML += "</node>";
    }while(current_node!=proof.back);
        returnXML +="</proof>";

    return returnXML;
}
function print_level_tree(root){
    var retVal ="<level>";
    retVal += JSON.stringify(root.saved_attr);
    if(root.leaves.length+root.subtrees.length > 0){
        root.leaves.iterate(function(x){ retVal+=print_level_tree(x); });
        root.subtrees.iterate(function(x){ retVal+=print_level_tree(x); });
    }

    retVal +="</level>";
    return retVal;
}

function load_proof(proofXML){
    var xmlDoc = $.parseXML( proofXML ),
    $xml = $( xmlDoc );
    alert(proofXML);
    TheProof.current.plane.compressTree();
    alert($xml.find("proof").children("node").length);
    $xml.find("proof").children("node").each(function(index){
        alert(index);

        if(index == 0){
            new_node = new ProofNode(TheProof);
            TheProof.front = new_node;
            TheProof.current = new_node;
            TheProof.back = new_node;
        }
        else{
            TheProof.addnode();
            new_node = TheProof.current;
        }
        new_node.id = $(this).children("id").first().text();
        new_node.name = $(this).children("name").first().text();
        alert(new_node.name);
        new_node.plane = new Level(TheProof.paper,null);
    });
    TheProof.current.plane.restoreTree();
}
