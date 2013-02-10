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