var p;
var R;
var debug;
var D = function(d) { debug = d; console.log(d) }
window.onload = function() {  
	R = Raphael("paper",window.screen.availWidth,window.screen.availHeight);
	TheProof = new Proof();
	ContextMenu = new ContextHandler();
	ZoomMenu(R);
}