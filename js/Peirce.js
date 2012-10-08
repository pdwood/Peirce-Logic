var p;
var R;
var debug;
var D = function(d) { debug = d; console.log(d) }
window.onload = function() {  
	TIMELINE_HEIGHT = 100;
	R = Raphael("paper",window.screen.availWidth,window.screen.availHeight-TIMELINE_HEIGHT*2);
	LogicMode = {PREMISE_MODE: 0, PROOF_MODE: 1, INSERTION_MODE: 2};
	CURRENT_MODE = LogicMode.PREMISE_MODE;
	TheProof = new Proof();
	ContextMenu = new ContextHandler();
	ZoomMenu(R);
	Timeline = Raphael('timeline', window.screen.availWidth, TIMELINE_HEIGHT);
	timeline_f.draw.call(Timeline, {proof:TheProof});
}