var debug;
var D = function(d) {
		debug = d;
		console.log(d);
	};
var R;

window.onload = function() {

	TIMELINE_HEIGHT = 100;
	TIMELINE_X_OFFSET = 30;
	TIMELINE_Y_OFFSET = 50;
	TIMELINE_BRANCH_VERTICAL_DISTANCE = 60;

	var R = Raphael("paper", window.screen.availWidth, window.screen.availHeight - TIMELINE_HEIGHT * 2);
	mode_width = 150;

	var MH = new ModeHandler(R, window.screen.availWidth - mode_width, 0, mode_width, 25);
	R.Mode_Handler = MH;

	TheProof = new Proof(R);

	ContextMenu = new ContextHandler(R);
	ZoomMenu(R);

	Timeline = Raphael('timeline', window.screen.availWidth, TIMELINE_HEIGHT);
	branches.draw.call(Timeline, TheProof);
};
