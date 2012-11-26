function save_proof(proof){
    var returnXML = "<?xml version='1.0' encoding='UTF-8' ?>";
    var current_node = null;
    returnXML +="<proof>";
    do{
        if(current_node == null){
            current_node = proof.front;
        }
        else{
            current_node = current_node.next;
        }
        returnXML += "<node>";
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