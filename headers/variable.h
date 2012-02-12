#ifndef VARIABLE_H
#define VARIABLE_H

#include <list>
#include <QGraphicsItem>
#include <QPainter>
#include <QMenu>
#include <QGraphicsSceneContextMenuEvent>
#include <QGraphicsScene>

#include "headers/node.h"

class Variable: public QGraphicsTextItem {
    public:
        Variable();

    private:
        Node* parent;
};

#endif // VARIABLE_H
