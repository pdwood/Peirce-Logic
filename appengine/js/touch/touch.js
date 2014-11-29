var mc;

function initHammer() {
	if( !TOUCH_ENABLED ) {
		return
	}
	return

	// Paper
	(function(){
		mc = new Hammer.Manager(document.getElementById("paper"));
		mc.add( new Hammer.Tap({ event: "doubletap", taps: 2 }));
		mc.on("doubletap", touchContext);
	})();
}

function touchContext(ev) {
	D(ev)
	D("Open up context menu");
	root = TheProof.current.uiTree.uinodes[0]
	coords = mouse_to_svg_coordinates(root.paper, ev)
	x = coords.x
	y = coords.y
	ContextMenu.SingleClickHandler(root, x,y, ev)
}
