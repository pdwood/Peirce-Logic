#include "headers/cut.h"

Cut::Cut(int node_level, Node* node_parent, QMenu* menu, QGraphicsItem* parent, QGraphicsScene* scene)
    :Node(node_level,node_parent), QGraphicsItem(parent, scene) {
    context_menu = menu;

    setFlag(QGraphicsItem::ItemIsMovable, true);
    setFlag(QGraphicsItem::ItemIsSelectable, true);
}

void Cut::contextMenuEvent(QGraphicsSceneContextMenuEvent* event) {
    scene()->clearSelection();
    setSelected(true);
    context_menu->exec(event->screenPos());
}

QRectF Cut::boundingRect() const {
    return QRectF(-20,-20,40,40);
}

void Cut::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget) {
    painter->setPen(QPen(Qt::black, 0));
    painter->drawRect(-20,-20,40,40);
}

