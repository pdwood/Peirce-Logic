var debug;
var D = function(d) {
		debug = d;
		console.log(d);
	};
var R;

window.onload = function() {
	PLANE_VOFFSET = 0;
	BOOTSTRAP_HEIGHT = 35;
	TIMELINE_HEIGHT = 100;

	PLANE_VOFFSET += BOOTSTRAP_HEIGHT;

	var R = Raphael("paper", window.screen.availWidth, window.screen.availHeight - 230);
	mode_width = 150;

	//var MH = new ModeHandler(R, window.screen.availWidth - mode_width, 0, mode_width, 25);
	//R.Mode_Handler = MH;

	TheProof = new Proof(R);
	R.Proof = TheProof;
	minimap = new Minimap(R);
	ContextMenu = new ContextHandler(R);


	document.getElementById('ModeLink').onclick = function(e){
		TheProof.execute_transfer();
	};
	//ZoomMenu(R);

	Timeline = Raphael('timeline', window.screen.availWidth, TIMELINE_HEIGHT);
	branches.draw.call(Timeline, TheProof);
};
