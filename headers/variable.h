#ifndef VARIABLE_H
#define VARIABLE_H

#include <list>
#include <QGraphicsItem>
#include <QPainter>
#include <QMenu>
#include <QGraphicsSceneContextMenuEvent>
#include <QGraphicsScene>

#include "node.h"

class Variable:public Node, public QGraphicsTextItem {
    public:
        Variable();

};

#endif // VARIABLE_H
