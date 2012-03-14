var p;
var R;
var debug;
var D = function(d) { debug = d; console.log(d) }
window.onload = function() {  
	R = Raphael("paper",6000,6000);
	TheProof = new Proof();
	ContextMenu = new ContextHandler();
}