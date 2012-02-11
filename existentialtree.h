#ifndef EXISTENTIALTREE_H
#define EXISTENTIALTREE_H

#include <vector>
#include <list>
#include <QGraphicsScene>
#include <QGraphicsItem>
#include <QPainter>
#include <QMenu>
#include <QGraphicsSceneContextMenuEvent>

class Node {
    public:
        Node(int node_level, Node* p=0):level(node_level),parent(p){;}
        int level;
        Node* parent;
};

class Variable:public Node, public QGraphicsTextItem {
    public:
        Variable();

};

class Cut:public Node, public QGraphicsItem {
    public:
        Cut(int node_level, Node* node_parent, QMenu* menu, QGraphicsItem* parent=0, QGraphicsScene* scene=0);
        void addChild(Node* n) ;//{this->children.push_back(n);}

        //bool advance();
        QRectF boundingRect() const;
        //QPainterPath shape() const;
        void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget);

        std::list<Node*> children;
        std::list<Variable*> items;

    protected:
        void contextMenuEvent(QGraphicsSceneContextMenuEvent* event);


    private:
        QPointF newPos;
        QMenu* context_menu;
};

class ExistentialTree {
    public:
        ExistentialTree();
        ~ExistentialTree();

    private:
        Node* root;
};

#endif // EXISTENTIALTREE_H
