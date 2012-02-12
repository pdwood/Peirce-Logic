#ifndef CUT_H
#define CUT_H

#include <list>
#include <QGraphicsItem>
#include <QPainter>
#include <QMenu>
#include <QGraphicsSceneContextMenuEvent>
#include <QGraphicsScene>

#include "headers/node.h"
#include "headers/variable.h"

class Cut:public Node, public QGraphicsItem {
    public:
        Cut(int node_level, Node* node_parent, QMenu* menu, QGraphicsItem* parent=0, QGraphicsScene* scene=0);

        //bool advance();
        QRectF boundingRect() const;
        //QPainterPath shape() const;
        void paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget);

        std::list<Cut*> children;
        std::list<Variable*> items;

    protected:
        void contextMenuEvent(QGraphicsSceneContextMenuEvent* event);


    private:
        QPointF newPos;
        QMenu* context_menu;
};

#endif // CUT_H
