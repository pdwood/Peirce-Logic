var mc;

function initHammer() {
	// Paper
	(function(){
		mc = new Hammer.Manager(document.getElementById("paper"));
		mc.add( new Hammer.Tap({ event: "doubletap", taps: 2 }));
		mc.on("doubletap", touchContext);
	})();

	// Save Button
	(function(){
		mc = new Hammer(document.getElementById("saveButton"));
		mc.on("tap", touchSave);
	})();

	// Load Button
	(function(){
		mc = new Hammer(document.getElementById("loadButton"));
		mc.on("tap", touchLoad);
	})();

	// New Button
	(function(){
		mc = new Hammer(document.getElementById("newButton"));
		mc.on("tap", touchNew);
	})();
}

function touchContext(ev) {
	D("Open up context menu");
	//root = TheProof.current.nodeTree
	//D(root)
	//ContextMenu.SingleClickHandler(root, 50, 50, {type:"dblclick"})
	//event.initMouseEvent({type:"dblclick", screenX:50, screenY:50});
}

function touchSave(ev) {
	$('#saveButton').click()
}

function touchLoad(ev) {
	$('#loadButton').click()
}

function touchNew(ev) {
	$('#newButton').click()
}
