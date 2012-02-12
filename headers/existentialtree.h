#ifndef EXISTENTIALTREE_H
#define EXISTENTIALTREE_H

#include "headers/node.h"
#include "headers/cut.h"
#include "headers/variable.h"

class ExistentialTree {
    public:
        ExistentialTree();
        ~ExistentialTree();

    private:
        Node* root;
};

#endif // EXISTENTIALTREE_H
