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


	R = Raphael("paper", PLANE_CANVAS_WIDTH() , PLANE_CANVAS_HEIGHT() );
	//R.setSize('100%', '100%');

	TheProof = new Proof(R);
	minimap = new Minimap(R);
	ContextMenu = new ContextHandler(R);

	document.getElementById('ModeLink').onclick = function(e){
		TheProof.execute_transfer();
	};

	Timeline = Raphael('timeline', TIMELINE_CANVAS_WIDTH(), TIMELINE_CANVAS_HEIGHT());
	branches.draw.call(Timeline, TheProof);

	$(window).resize( function() {
		minimap.windowResizeView();
		branches.draw.call(Timeline);
    	//Timeline.setViewBox(0, 0, TIMELINE_CANVAS_WIDTH(), TIMELINE_CANVAS_HEIGHT(), true);
	});
};
