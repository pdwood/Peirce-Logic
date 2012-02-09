#ifndef EXISTENTIALTREE_H
#define EXISTENTIALTREE_H

#include <vector>
#include <list>
#include <QGraphicsScene>
#include <QGraphicsItem>

class Node {
    public:
        Node(int l, Node* p=0):level(l),parent(p){;}
        int level;
        Node* parent;
};

class Variable:public Node, public QGraphicsTextItem {
    public:
        Variable();
        ~Variable();

};


class Cut:public Node, public QGraphicsItem {
    public:
        Cut();
        ~Cut();
        void addChild(Node* n) {this->children.push_back(n);}

        std::list<Node*> children;
        std::list<Variable*> items;
};
class ExistentialTree {
    public:
        ExistentialTree();
        ~ExistentialTree();

    private:
        Node* root;
};

#endif // EXISTENTIALTREE_H
