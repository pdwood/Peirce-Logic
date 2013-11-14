var debug;
var D = function(d) {
		debug = d;
		console.log(d);
	};
var R;

window.onload = function() {
	PLANE_VOFFSET = 0;
	BOOTSTRAP_HEIGHT = 40;//35;
	TIMELINE_HEIGHT = 100;
	DEFAULT_PLANE_WIDTH = 5000;
	DEFAULT_PLANE_HEIGHT = 5000;
	DEFAULT_CHILD_WIDTH = 50;
	DEFAULT_CHILD_HEIGHT = 50;
	DEFAULT_CURVATURE = 20;
	PLANE_VOFFSET += BOOTSTRAP_HEIGHT;
	PLANE_CANVAS_WIDTH = function() { return $(window).width(); };
	PLANE_CANVAS_HEIGHT = function() { return $(window).height() - TIMELINE_HEIGHT - PLANE_VOFFSET; };
	TIMELINE_CANVAS_WIDTH = PLANE_CANVAS_WIDTH;
	TIMELINE_CANVAS_HEIGHT = function() { return TIMELINE_HEIGHT; };

	R = Raphael("paper", PLANE_CANVAS_WIDTH(), PLANE_CANVAS_HEIGHT() );

	TheProof = new Proof(R);
	AddUIReactors(TheProof);
	minimap = new Minimap(R);
	ContextMenu = new ContextHandler(R);

	TheProof.changeMode(TheProof.nextMode());
	document.getElementById('ModeLink').onclick = function(e){
		TheProof.changeMode(TheProof.nextMode(TheProof.currentMode));
	};
	document.getElementById('backwardtick').onclick = function(e){
		if(TheProof.current.prev) {
			TheProof.select(TheProof.current.prev);
		}
	};
	document.getElementById('forwardtick').onclick = function(e){
		if(TheProof.current.next.head) {
			TheProof.select(TheProof.current.next.head.val);
		}
	};

	Timeline = Raphael('timeline', '100%', TIMELINE_CANVAS_HEIGHT());
	branches.draw.call(Timeline, TheProof);

	$(window).resize( function() {
	    minimap.windowResizeView();
	    branches.draw.call(Timeline);
	    R.setSize(PLANE_CANVAS_WIDTH(), PLANE_CANVAS_HEIGHT());
	}
	);
};
