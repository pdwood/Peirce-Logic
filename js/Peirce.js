var p;
var R;
var debug;
var D = function(d) { debug = d; console.log(d) }
window.onload = function() {  
	R = Raphael("paper",window.screen.availWidth,window.screen.availHeight);
	LogicMode = {PREMISE_MODE: 0, PROOF_MODE: 1, INSERTION_MODE: 2};
	CURRENT_MODE = LogicMode.PREMISE_MODE;
	TheProof = new Proof();
	ContextMenu = new ContextHandler();
	ZoomMenu(R);
}