var mc;

function initHammer() {
	if( !TOUCH_ENABLED ) {
		return
	}

	// Paper
	(function(){
		mc = new Hammer.Manager(document.getElementById("paper"));
		mc.add( new Hammer.Tap({ event: "doubletap", taps: 2 }));
		mc.on("doubletap", touchContext);
	})();
}

function touchContext(ev) {
	D("Open up context menu");
	//root = TheProof.current.nodeTree
	//D(root)
	//ContextMenu.SingleClickHandler(root, 50, 50, {type:"dblclick"})
	//event.initMouseEvent({type:"dblclick", screenX:50, screenY:50});
}
