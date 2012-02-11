#ifndef PROOFSCENE_H
#define PROOFSCENE_H

#include <iostream>
#include "workspace.h"
#include <QGraphicsScene>

class ProofScene : public QGraphicsScene {
    Q_OBJECT

    public:
        ProofScene(Workspace* work_space, QMenu* menu=0, QObject* parent=0);

    public slots:
        void createCut();
        void createVar();
        //void itemSelected();

    //public slots:
        //void variableEditorLostFocus();

    //protected:
        //void mousePressEvent(QGraphicsSceneMouseEvent *mouseEvent);
        //void mouseMoveEvent(QGraphicsSceneMouseEvent *mouseEvent);
        //void mouseReleaseEvent(QGraphicsSceneMouseEvent *mouseEvent);

    private:
        QColor text_color;
        QColor cut_color;
        Workspace* workspace;

        QMenu* proof_menu;
        QAction* create_cut_action;
        QAction* create_var_action;

};
#endif // PROOFSCENE_H
