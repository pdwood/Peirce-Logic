#ifndef WINDOW_H
#define WINDOW_H

#include <QMainWindow>
#include <QGraphicsScene>

#include "proofscene.h"

namespace Ui {
    class Window;
}

class Window : public QMainWindow {
    Q_OBJECT

    public:
        explicit Window(QWidget *parent = 0);
        ~Window();

    private slots:
    void setPremiseMode();
    void setProofMode();

    private:
        Ui::Window *ui;
        ProofScene* scene;
        QMenu* proof_menu;
        QAction* premise_mode_action;
        QAction* proof_mode_action;
};

#endif // WINDOW_H
