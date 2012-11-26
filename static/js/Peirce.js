var debug;
var D = function(d) { debug = d; console.log(d) }
var R;

window.onload = function() {  

	var TIMELINE_HEIGHT = 100;
	var R = Raphael("paper",window.screen.availWidth,window.screen.availHeight-TIMELINE_HEIGHT*2);
	mode_width = 90;
	
	ModeHandler(R,window.screen.availWidth-100,10,mode_width,300);

	TheProof = new Proof(R);

	ContextMenu = new ContextHandler(R);
	ZoomMenu(R);

	Timeline = Raphael('timeline', window.screen.availWidth, TIMELINE_HEIGHT);
	timeline_f.draw.call(Timeline, {proof:TheProof});
}

var induce_overlay = function(name,x,y,dx,dy) {
	overlay_div = $('<div id="' + name + '_overlay"> </div>');
	overlay_div.css({"z-index" : 2, "position" : "absolute"});
	overlay_div.css("left",x);
	overlay_div.css("top",y);
	$("#paper").parent().append(overlay_div);
	return Raphael(name+"_overlay",dx,dy);
}