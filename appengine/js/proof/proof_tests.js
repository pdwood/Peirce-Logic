var N1 = new Node();
var A = new Node(N1);
N1.subtrees.push_back(A);
A.leaves.push_back({text:"a"});
N1.leaves.push_back({text:"b"});


//C (A (B) (C))
var N1 = new Node();
N1.leaves.push_back({text:"C"});
var N2 = new Node(N1);
N1.subtrees.push_back(N2);
N2.leaves.push_back({text:"A"});
N2.subtrees.push_back(new Node(N2));
N2.subtrees.begin().val.leaves.push_back({text:"B"});
N2.subtrees.push_front(new Node(N2));
N2.subtrees.begin().val.leaves.push_back({text:"C"});
var N3 = Node.node_to_node_skeleton(N1);


//( (A (B) C) (B) )
var N1 = Node.NodeSkeleton();
N1.subtrees.push(Node.NodeSkeleton());
N1.subtrees[0].add_lit("B",false);
N1.subtrees[0].add_lit("A",false);
N1.subtrees[0].subtrees[1].add_lit("C",true);
N1.subtrees[0].subtrees[1].add_lit("B",false);

// A (B) (C)
var N1 = Node.NodeSkeleton();
N1.add_lit("A", true);
N1.add_lit("B", false);
N1.add_lit("C", false);

//(U V (W))
var N1 = Node.NodeSkeleton();
N1.add_lit("U",true);
N1.subtrees[0].add_lit("V",true);
N1.subtrees[0].add_lit("W", false);

// ((A B (C))) ((D ((E)))), tests double-cut remover
var N1 = Node.NodeSkeleton();
N1.subtrees.push(Node.NodeSkeleton());
N1.subtrees[0].subtrees.push(Node.NodeSkeleton());
N1.subtrees[0].subtrees[0].add_lit("A",true);
N1.subtrees[0].subtrees[0].add_lit("B",true);
N1.subtrees[0].subtrees[0].add_lit("C",false);
N1.subtrees.push(Node.NodeSkeleton());
N1.subtrees[1].add_lit("D",false);
N1.subtrees[1].subtrees[0].subtrees.push(Node.NodeSkeleton());
N1.subtrees[1].subtrees[0].subtrees[0].add_lit("E",false);



//(U (V))((U) V)(U)(V)
var N1 = Node.NodeSkeleton();
N1.add_lit("U",false);
N1.subtrees[0].add_lit("V",false);
N1.add_lit("V",false);
N1.subtrees[1].add_lit("U",false);
N1.add_lit("U",false);
N1.add_lit("V",false);


//(U V (W)) (U (W)) (W (U)) V
var N1 = Node.NodeSkeleton();
N1.add_lit("U", false);
N1.add_lit("U",false);
N1.add_lit("W", false);
N1.add_lit("V", true);
N1.subtrees[0].add_lit("V",true);
N1.subtrees[0].add_lit("W",false);
N1.subtrees[1].add_lit("W",false);
N1.subtrees[2].add_lit("U",false);


file:///C:/Users/caulfb2/Documents/GitHub/Peirce-Logic/appengine/templates/index.html