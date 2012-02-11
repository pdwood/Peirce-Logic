#ifndef EXISTENTIALTREE_H
#define EXISTENTIALTREE_H

#include "node.h"
#include "cut.h"
#include "variable.h"

class ExistentialTree {
    public:
        ExistentialTree();
        ~ExistentialTree();

    private:
        Node* root;
};

#endif // EXISTENTIALTREE_H
