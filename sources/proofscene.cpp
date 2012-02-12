#include "headers/proofscene.h"

ProofScene::ProofScene(Workspace* work_space, QMenu* menu, QObject* parent) : QGraphicsScene(parent) {
     workspace = work_space;
     text_color = Qt::black;
     cut_color = Qt::black;
     proof_menu = menu;

     create_cut_action = new QAction(tr("Make Cut"),this);
     connect(create_cut_action, SIGNAL(triggered()),
                  this, SLOT(createCut()));
     create_var_action = new QAction(tr("Make Variable"),this);
     connect(create_var_action, SIGNAL(triggered()),
                  this, SLOT(createVar()));

     proof_menu->addAction(create_cut_action);
     proof_menu->addAction(create_var_action);
 }

void ProofScene::createVar() {
    std::cout << "Asdfa" << "\n";
}

void ProofScene::createCut() {
    std::cout << "1234" << "\n";
}
