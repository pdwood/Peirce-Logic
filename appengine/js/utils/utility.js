function arrays_equal(a,b) {
	return !(a<b || b<a);
}


function induce_overlay(name,x,y,dx,dy) {
	overlay_div = $('<div id="' + name + '_overlay"> </div>');
	overlay_div.css({"z-index" : 2, "position" : "absolute"});
	overlay_div.css("left",x);
	overlay_div.css("top",y);
	$("#paper").parent().append(overlay_div);
	return Raphael(name+"_overlay",dx,dy);
}
