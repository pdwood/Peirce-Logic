#ifndef NODE_H
#define NODE_H

class Node {
    public:
        Node(int node_level, Node* p=0):level(node_level),parent(p){;}
        int level;
        Node* parent;
};

#endif // NODE_H
