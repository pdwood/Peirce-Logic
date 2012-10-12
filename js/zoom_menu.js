var zoomScaleMixin = function(R) {
	return function() {
		return [R._viewBox[2]/R.width,R._viewBox[3]/R.height];
	}
}

var zoomOffsetMixin = function(R) {
	return function() {
		return [R._viewBox[0],R._viewBox[1]];
	}
}

var ZoomMenu = function (R,R_overlay) {
	//setup mixins
	R.zoomScale = zoomScaleMixin(R);
	R.zoomOffset = zoomOffsetMixin(R);
	x = window.screen.availWidth - 70;
	y = 50;
	width = 37;
	height = 130;
	relief = 4;

	R_overlay = induce_overlay('zoom_menu',x,y,width+relief,height+relief);
	
	var menu_box = R_overlay.rect(relief/2, relief/2, width, height, 12).attr({fill: 'black', stroke: '#aaa', 'stroke-width': 2, opacity: 0.6});
	
	var mx = menu_box.attrs.x + menu_box.attrs.width/2;
	var my = menu_box.attrs.y + 20;
	var maxButton = R_overlay.set();
	maxButton.push(
		R_overlay.text(mx,my,"+").attr({"font-size":24,fill: "#bbb", stroke: "#bbb"})
	);
	maxButton.push(
		R_overlay.circle(mx+.4,my,10).attr({fill: "#bbb", "fill-opacity":0, stroke: "#bbb", "stroke-width":4})
	);
	maxButton.attr({opacity: .5});
	maxButton.mouseover(function () {
		maxButton.animate({opacity: 1}, 500);
	});
	maxButton.mouseout(function () {
		maxButton.animate({opacity: .5}, 500);
	});
	
	my += 30;
	var minButton = R_overlay.set();
	minButton.push(
		R_overlay.text(mx,my-2.4,"-").attr({"font-size":30,fill: "#bbb", stroke: "#bbb"})
	);
	minButton.push(
		R_overlay.circle(mx+.4,my,10).attr({fill: "#bbb", "fill-opacity":0, stroke: "#bbb", "stroke-width":4})
	);
	minButton.attr({opacity: .5});
	minButton.mouseover(function () {
		minButton.animate({opacity: 1}, 500);
	});
	minButton.mouseout(function () {
		minButton.animate({opacity: .5}, 500);
	});
	
	my += 30;
	var leftButton = R_overlay.set();
	leftButton.push(
		R_overlay.text(mx-.5,my-1.3,"\u25C0").attr({"font-size":12,fill: "#bbb", stroke: "#bbb"})
	);
	leftButton.push(
		R_overlay.circle(mx+.4,my,10).attr({fill: "#bbb", "fill-opacity":0, stroke: "#bbb", "stroke-width":4})
	);
	leftButton.attr({opacity: .5});
	leftButton.mouseover(function () {
		leftButton.animate({opacity: 1}, 500);
	});
	leftButton.mouseout(function () {
		leftButton.animate({opacity: .5}, 500);
	});
	
	my += 30;
	var rightButton = R_overlay.set();
	rightButton.push(
		R_overlay.text(mx+1,my-1.3,"\u25B6").attr({"font-size":12,fill: "#bbb", stroke: "#bbb"})
	);
	rightButton.push(
		R_overlay.circle(mx+.4,my,10).attr({fill: "#bbb", "fill-opacity":0, stroke: "#bbb", "stroke-width":4})
	);
	rightButton.attr({opacity: .5});
	rightButton.mouseover(function () {
		rightButton.animate({opacity: 1}, 500);
	});
	rightButton.mouseout(function () {
		rightButton.animate({opacity: .5}, 500);
	});
	///////////////////////////////////////////////////
	
	OrignalViewBox = R.setViewBox(R.DEFAULT_PLANE_WIDTH/2-R.width,R.DEFAULT_PLANE_HEIGHT/2-R.height,R.width,R.height);
	ZoomLevel = 1;
	ZoomScale = .2;
	ZoomMax = 1;
	ZoomMin = 1.4;
	maxButton.mousedown(function() {
		ZoomLevel = Math.max(ZoomMax,ZoomLevel-ZoomScale);
		mw = R.width*ZoomLevel;
		mh = R.height*ZoomLevel;
		mx = R._viewBox[0] - (mw-R._viewBox[2])/2;
		my = R._viewBox[1] - (mh-R._viewBox[3])/2;
		R.setViewBox(mx,my,mw,mh);
	});
	minButton.mousedown(function() {
		ZoomLevel = Math.min(ZoomMin,ZoomLevel+ZoomScale);
		mw = R.width*ZoomLevel;
		mh = R.height*ZoomLevel;
		mx = R._viewBox[0] - (mw-R._viewBox[2])/2;
		my = R._viewBox[1] - (mh-R._viewBox[3])/2;
		R.setViewBox(mx,my,mw,mh);
	});
	
	
	///////////////////////////////////////////////////
	
	leftButton.mousedown(function() {
		TheProof.prev();
	});
	rightButton.mousedown(function() {
		TheProof.next();
	});

	///////////////////////////////////////////////////
	
	/*var minRange = 1;
	var maxRange = 5;
	var zoom_slider = 	
	
	 /*$('	\
		<div data-role="controlgroup" data-type="horizontal">	\
			<a href="" data-role="button">+</a>	\
			<a href="" data-role="button">-</a>	\
		</div>');
		//<div> <input type="range" name="slider" id="slider-fill" value="1" min="1" max="100" /> </div> ');
		
	
	OrignalViewBox = [0,0,R.width,R.height];
	ZoomLevel = 1;
	$(zoom_slider.children()[0]).bind( "change", function(event, ui) {
		z = parseInt(event.srcElement.value)
		zoomLevel = z/100;
		R.setViewBox(
			R._orignalViewbox[0]*1/z,
			R._orignalViewbox[1]*1/z,
			R._orignalViewbox[2]*1/z,
			R._orignalViewbox[3]*1/z
		);
	});
	$("#paper").parent().append(zoom_menu);*/
}
