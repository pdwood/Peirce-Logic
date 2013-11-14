function UINodeTree(R, node_tree, subtree_class, leaf_class, tree_attrs) {
    this.R = R;
    this.tree = node_tree;
    this.subtree_class = subtree_class;
    this.leaf_class = leaf_class;
    this.uinodes = {};
    if(tree_attrs) { // input attr union default attr
        this.constructUI(function(id,uinode) {
            var attr = tree_attrs[id];
            var defaultAttrs = uinode.defaultAttr();
            for(var a in defaultAttrs) {
                if(!(a in attr)) {
                    attr[a] = defaultAttrs[a];
                }
            }
            uinode.setShapeAttr(attr);
        });
    } else { // just default attr
        this.constructUI(function(id,uinode) {
            uinode.setShapeAttr(uinode.defaultAttr());
        });
    }
}

UINodeTree.prototype.constructUI = function(attr_decorator) {
    var treeDict = {};
    if (this.tree) // convert node tree into id:node dict
        treeDict = this.tree.toDict();
    for(var id in treeDict) {
        var uinode = null;
        var node = treeDict[id];
        if(node.isLeaf())
            uinode = new this.leaf_class(this.R, node, this.uinodes);
        else
            uinode = new this.subtree_class(this.R, node, this.uinodes);
        uinode.createShape();
        attr_decorator(id, uinode);
        this.uinodes[id] = uinode;
    }
}

UINodeTree.prototype.deconstructUI = function() {
    for(var id in this.uinodes) {
        this.uinodes[id].removeShape();
    }
    this.uinodes = null;
}

function UINode(R, node, nodeDict) {
    this.node = node;
    this.nodeDict = nodeDict;

    this.paper = R;
    this.shape = null;
}

UINode.prototype.getUINode = function(node) {
    if(node)
        return this.nodeDict[node.getIdentifier()];
    return null;
};

UINode.prototype.defaultAttr = function() {
    return {};
}

UINode.prototype.createShape = function(attr) {
    this.shape = null;
}

UINode.prototype.removeShape = function() {
    if(this.shape) {
        this.shape.remove();
        this.shape = null;
    }
}

UINode.prototype.getShapeAttr = function() {
    return (this.shape.attr ? this.shape.attr : {});
}

UINode.prototype.setShapeAttr = function(attr) {
    this.shape.attr(attr);
}

UINode.prototype.select = function(e) {
	if(e.ctrlKey) {
		ContextMenu.changeSelection(this.parent);
	}
}

UINode.prototype.setSelected = function(flag) {
    // toggle on flag
}

UINode.prototype.clicked = function(event) {
    if (!event.ctrlKey) {
		//Menu intialized with node,node's level, and mouse x/y
        var coords = mouse_to_svg_coordinates(this,event);
        ContextMenu.NewContext(this,coords.x+event.clientX,coords.y+event.clientY-PLANE_VOFFSET);
		//var coords = mouse_to_svg_coordinates(this,event);
//		ContextMenu.NewContext(this.parent,coords.x+event.clientX,coords.y+event.clientY-PLANE_VOFFSET);
	}

}

UINode.prototype.drag = function(dx,dy) {
    this.dragStart();
    this.dragMove(dx,dy);
    this.dragEnd();
}

UINode.prototype.dragStart = function() {
    // drag start inital state
}

//shape callback for drag starting
UINode.prototype.onDragStart = function() {
    this.parent.dragStart();
    if(this.parent.superClass)
        this.parent.superClass.dragStart.call(this);
};

UINode.prototype.dragMove = function(dx, dy) {
    minimap.redraw(); // global minimap
}

//shape callback for drag move
UINode.prototype.onDragMove = function(dx,dy) {
    this.parent.dragMove(dx,dy);
    if(this.parent.superClass)
        this.parent.superClass.dragMove.call(this,dx,dy);
};

UINode.prototype.dragEnd = function () {
    this.paper.renderfix();
}

//shape callback for drag ending
UINode.prototype.onDragEnd = function() {
    this.parent.dragEnd();
    if(this.parent.superClass)
        this.parent.superClass.dragEnd.call(this);
};




