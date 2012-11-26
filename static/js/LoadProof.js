function load_proof(proofXML){
    var xmlDoc = $.parseXML( proofXML ),
    $xml = $( xmlDoc );
    alert(proofXML);
    TheProof.current.plane.compressTree();
    alert($xml.find("proof").children("node").length);
    $xml.find("proof").children("node").each(function(index){
        alert(index);
        new_node = new ProofNode(TheProof);
        new_node.id = $(this).children("id").first().text();
        new_node.name = $(this).children("name").first().text();
        alert(new_node.name);
        if(index == 0){
            TheProof.front = new_node;
            TheProof.current = new_node;
            new_node.plane = new Level(TheProof.paper,null);
        }
        else{
            TheProof.addnode();
            TheProof.current = new_node;
        }
    });
    TheProof.current.plane.restoreTree();
}