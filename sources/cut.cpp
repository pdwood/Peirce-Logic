#include "cut.h"

Cut::Cut(int node_level, Node* node_parent, QMenu* menu, QGraphicsItem* parent, QGraphicsScene* scene)
    :Node(node_level,node_parent), QGraphicsItem(parent, scene) {
    context_menu = menu;

    setFlag(QGraphicsItem::ItemIsMovable, true);
    setFlag(QGraphicsItem::ItemIsSelectable, true);
}

Cut::~Cut() //frees children + variables
{
    std::list<Cut *>::iterator itr;
    std::list<Variable *>::iterator itr2;

    for(itr = children.begin();itr != children.end();itr++)
    {
        delete *itr;
    }
    for(itr2 = items.begin();itr2 != items.end();itr2++)
    {
        delete *itr2;
    }
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

