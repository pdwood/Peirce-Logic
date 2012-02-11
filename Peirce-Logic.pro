
QT       += core gui

TARGET = Peirce-Logic
TEMPLATE = app

SOURCES +=  sources\main.cpp \
            sources\window.cpp \
            sources\workspace.cpp \
            sources\existentialtree.cpp \
            sources\proofscene.cpp \
            sources\node.cpp \
            sources\variable.cpp \
            sources\cut.cpp

HEADERS  += headers\window.h \
            headers\workspace.h \
            headers\existentialtree.h \
            headers\proofscene.h \
            headers\node.h \
            headers\cut.h \
            headers\variable.h

FORMS    += window.ui











