 var Minimap = function (R) {
 	var x = window.screen.availWidth - 500;
 	var y = window.screen.availHeight - 500;
	var width = 250;
	var height = 250;
	var relief = 4;

	var R_overlay = induce_overlay('minimap', x, y, width, height);

	R_overlay.rect(x, x, width, height).attr({fill: '#9DF2A3', stroke: 'black', 'stroke-width': 2});
	D(R_overlay);
}