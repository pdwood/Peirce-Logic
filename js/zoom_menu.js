var zoomScale = function() {
	return [R._viewBox[2]/R.width,R._viewBox[3]/R.height];
}

var zoomOffset = function() {
	return [R._viewBox[0],R._viewBox[1]];
}

var ZoomMenu = function (oR) {
	var bound = 10;
	var x = bound;
	var y = oR.canvas.offsetTop+bound;
	
	menu_div = $('<div id="zoom_menu"> </div>');
	menu_div.css({"z-index" : 2, "position" : "absolute"});
	menu_div.css("right",x);
	menu_div.css("top",y);
	$("#paper").parent().append(menu_div);
	var height = 73;
	var zR = Raphael("zoom_menu",45,height);
	
	///////////////////////////////////////////////////
	
	var menu_box = zR.rect(3, 3, 37, height-4, 12).attr({fill: 'black', stroke: '#aaa', 'stroke-width': 2, opacity: 0.6});
	
	var mx = menu_box.attrs.x + menu_box.attrs.width/2;
	var my = menu_box.attrs.y + 20;
	var maxButton = zR.set();
	maxButton.push(
		zR.text(mx,my,"+").attr({"font-size":24,fill: "#bbb", stroke: "#bbb"})
	);
	maxButton.push(
		zR.circle(mx+.4,my,10).attr({fill: "#bbb", "fill-opacity":0, stroke: "#bbb", "stroke-width":4})
	);
	maxButton.attr({opacity: .5});
	maxButton.mouseover(function () {
		maxButton.animate({opacity: 1}, 500);
	});
	maxButton.mouseout(function () {
		maxButton.animate({opacity: .5}, 500);
	});
	
	my += 30;
	var minButton = zR.set();
	minButton.push(
		zR.text(mx,my-2.4,"-").attr({"font-size":30,fill: "#bbb", stroke: "#bbb"})
	);
	minButton.push(
		zR.circle(mx+.4,my,10).attr({fill: "#bbb", "fill-opacity":0, stroke: "#bbb", "stroke-width":4})
	);
	minButton.attr({opacity: .5});
	minButton.mouseover(function () {
		minButton.animate({opacity: 1}, 500);
	});
	minButton.mouseout(function () {
		minButton.animate({opacity: .5}, 500);
	});
	
	///////////////////////////////////////////////////
	
	OrignalViewBox = oR.setViewBox(oR.DEFAULT_PLANE_WIDTH/2-oR.width,oR.DEFAULT_PLANE_HEIGHT/2-oR.height,oR.width,oR.height);
	ZoomLevel = 1;
	ZoomScale = .2;
	ZoomMax = 1;
	ZoomMin = 1.4;
	maxButton.mousedown(function() {
		ZoomLevel = Math.max(ZoomMax,ZoomLevel-ZoomScale);
		mw = oR.width*ZoomLevel;
		mh = oR.height*ZoomLevel;
		mx = oR._viewBox[0] - (mw-oR._viewBox[2])/2;
		my = oR._viewBox[1] - (mh-oR._viewBox[3])/2;
		oR.setViewBox(mx,my,mw,mh);
	});
	minButton.mousedown(function() {
		ZoomLevel = Math.min(ZoomMin,ZoomLevel+ZoomScale);
		mw = oR.width*ZoomLevel;
		mh = oR.height*ZoomLevel;
		mx = oR._viewBox[0] - (mw-oR._viewBox[2])/2;
		my = oR._viewBox[1] - (mh-oR._viewBox[3])/2;
		oR.setViewBox(mx,my,mw,mh);
	});
	
	///////////////////////////////////////////////////
	
	

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
