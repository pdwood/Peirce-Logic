#ifndef VARIABLE_H
#define VARIABLE_H

#include <string>
#include <QGraphicsItem>
#include <QPainter>
#include <QMenu>
#include <QGraphicsSceneContextMenuEvent>
#include <QGraphicsScene>

#include "node.h"

class Variable:public Node, public QGraphicsTextItem {
    public:
        Variable(std::string s, Node *p, int l):label(s),parent(p),level(l) {}
		const std::string &name() {return s;}
		void rename(std::string &s) { label = s; }
		
	private:
		std::string label;

};

#endif // VARIABLE_H
