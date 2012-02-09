#ifndef EXISTENTIALTREE_H
#define EXISTENTIALTREE_H

#include <vector>
#include <QGraphicsScene>
#include <QGraphicsItem>

class Node {
    public:
        Node(int l, Node* p=0):level(l),parent(p){;}
        int level;
        Node* parent;
};

class Cut:public Node, public QGraphicsItem {
    public:
        Cut();
        ~Cut();
        addChild(Node* n) {children.push_back(n);}

        list<Node*> children;
        list<Variable*> items;
};

class Variable:public Node, public QGraphicsTextItem {
    public:


};

class ExistentialTree {
    public:
        ExistentialTree();
        ~ExistentialTree();

    private:
        Node* root;
};

#endif // EXISTENTIALTREE_H
