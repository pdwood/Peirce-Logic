#include "window.h"
#include "ui_window.h"

Window::Window(QWidget *parent)
               :QMainWindow(parent),ui(new Ui::Window) {
    ui->setupUi(this);

    proof_menu = ui->menuProof;

    premise_mode_action = new QAction("Premise Mode",this);
    connect(premise_mode_action,SIGNAL(triggered()), this, SLOT(setPremiseMode()));
    proof_mode_action = new QAction("Proof Mode",this);
    connect(proof_mode_action,SIGNAL(triggered()), this, SLOT(setProofMode()));

    proof_menu->addAction(premise_mode_action);
    proof_menu->addAction(proof_mode_action);

    scene = new ProofScene(NULL, proof_menu,this);

    ui->graphicsView->setScene(scene);
}

Window::~Window()
{
    delete ui;
}

void Window::setPremiseMode() {
    std::cout << "fOOOO" << "\n";;
}

void Window::setProofMode() {
    std::cout << "BARABRRR" << "\n";;
}
