//use popup plugin
(function () {
var tokenRegex = /\{([^\}]+)\}/g,
    objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, // matches .xxxxx or ["xxxxx"] to run over object properties
    replacer = function (all, key, obj) {
        var res = obj;
        key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
            name = name || quotedName;
            if (res) {
                if (name in res) {
                    res = res[name];
                }
                typeof res == "function" && isFunc && (res = res());
            }
        });
        res = (res == null || res == obj ? all : res) + "";
        return res;
    },
    fill = function (str, obj) {
        return String(str).replace(tokenRegex, function (all, key) {
            return replacer(all, key, obj);
        });
    };
    Raphael.fn.popup = function (X, Y, set, pos, ret) {
        pos = String(pos || "top-middle").split("-");
        pos[1] = pos[1] || "middle";
        var r = 5,
            bb = set.getBBox(),
            w = Math.round(bb.width),
            h = Math.round(bb.height),
            x = Math.round(bb.x) - r,
            y = Math.round(bb.y) - r,
            gap = Math.min(h / 2, w / 2, 10),
            shapes = {
                top: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}l-{right},0-{gap},{gap}-{gap}-{gap}-{left},0a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
                bottom: "M{x},{y}l{left},0,{gap}-{gap},{gap},{gap},{right},0a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
                right: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}l0-{bottom}-{gap}-{gap},{gap}-{gap},0-{top}a{r},{r},0,0,1,{r}-{r}z",
                left: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}l0,{top},{gap},{gap}-{gap},{gap},0,{bottom}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z"
            },
            offset = {
                hx0: X - (x + r + w - gap * 2),
                hx1: X - (x + r + w / 2 - gap),
                hx2: X - (x + r + gap),
                vhy: Y - (y + r + h + r + gap),
                "^hy": Y - (y - gap)
                
            },
            mask = [{
                x: x + r,
                y: y,
                w: w,
                w4: w / 4,
                h4: h / 4,
                right: 0,
                left: w - gap * 2,
                bottom: 0,
                top: h - gap * 2,
                r: r,
                h: h,
                gap: gap
            }, {
                x: x + r,
                y: y,
                w: w,
                w4: w / 4,
                h4: h / 4,
                left: w / 2 - gap,
                right: w / 2 - gap,
                top: h / 2 - gap,
                bottom: h / 2 - gap,
                r: r,
                h: h,
                gap: gap
            }, {
                x: x + r,
                y: y,
                w: w,
                w4: w / 4,
                h4: h / 4,
                left: 0,
                right: w - gap * 2,
                top: 0,
                bottom: h - gap * 2,
                r: r,
                h: h,
                gap: gap
            }][pos[1] == "middle" ? 1 : (pos[1] == "top" || pos[1] == "left") * 2];
            var dx = 0,
                dy = 0,
                out = this.path(fill(shapes[pos[0]], mask)).insertBefore(set);
            switch (pos[0]) {
                case "top":
                    dx = X - (x + r + mask.left + gap);
                    dy = Y - (y + r + h + r + gap);
                break;
                case "bottom":
                    dx = X - (x + r + mask.left + gap);
                    dy = Y - (y - gap);
                break;
                case "left":
                    dx = X - (x + r + w + r + gap);
                    dy = Y - (y + r + mask.top + gap);
                break;
                case "right":
                    dx = X - (x - gap);
                    dy = Y - (y + r + mask.top + gap);
                break;
            }
            out.translate(dx, dy);
            if (ret) {
                ret = out.attr("path");
                out.remove();
                return {
                    path: ret,
                    dx: dx,
                    dy: dy
                };
            }
            set.translate(dx, dy);
            return out;
    };
})();


timeline_f = {
	draw: function(options) {
		var settings = {color: options.color || '#f00',
						normal_r: options.normal_r || 7,
						highlight_r: options.highlight_r || 10,
						highlight_fill: options.highlight_fill || options.color || '#f00',
						normal_fill: options.normal_fill || '#fff',
						popup_text_attr: options.popup_text_attr || {fill:'#000', font: '10px verdana, arial, helvetica, sans-serif'},
						popup_attr: options.popup_attr || {fill: options.normal_fill||'#fff', "stroke-width":2, stroke: options.color||'#f00'},
						select_index: options.select_index || 0
						},
			pixels_per_index = 100,
			range = options.proof.last.id
			fclick = options.proof.select;
		
		
		//calculate the range in days, avoid division by 0
		if (range) {
			pixels_per_index = (this.width-60)/range;
		}
		
		if(pixels_per_index > 100){
			pixels_per_index = 100;
		}

		dots = timeline.draw_dots.call(this, options.proof, settings, {pixels_per_index: pixels_per_index, x_offset: 30, y_offset: this.height-70}, fclick);
		TimelineHelper.highlight(dots, options.proof.current.id, settings);
	},
	
	draw_dots: function(proof, settings, params, fclick) {
		var dots = [],
			last = params.x_offset,
			title = this.text(40, params.y_offset - 25, 'title').attr(settings.popup_text_attr).attr({'font-weight': 'bold', 'font-size': '12px'}),
			label = this.set().push(title).hide(),
			popup = ''
			length = proof.last.id
			current = proof.front;
						
		for(var i=0;i<length;i++) {
			var center = i * params.pixels_per_index + params.x_offset;
			if(i > 0) {
				last = (i-1) * params.pixels_per_index + params.x_offset;
				if(center < (last + settings.normal_r*2)) { //guarantee no overlapped with last node
					center = last + settings.normal_r*2;
				}
				//if center > width then resize the width 
				this.path('M'+ last + ' ' + params.y_offset + 'L' + center + ' ' + params.y_offset).attr({stroke:settings.color, "stroke-width":3}).toBack();
			}

			dots[i] = this.circle(center, params.y_offset, settings.normal_r).attr({fill:settings.normal_fill, stroke:settings.color,"stroke-width":2});
			
			(function (canvas, proofnode) {
				dots[i].hover(function() {
					this.attr({r: settings.highlight_r});
					var name = (proofnode.name.length > 40)? proofnode.name.substring(0, 40) + "..." : proofnode.name;
					title.attr({text: name});
					label.show();
					var x = this.getBBox().x + this.getBBox().width/2;
					popup = canvas.popup(x, params.y_offset-15, label, "top-middle").attr(settings.popup_attr);						
					if(popup.getBBox().x < params.x_offset) {
						popup.remove();
						popup = canvas.popup(x, params.y_offset-15, label, "top-left").attr(settings.popup_attr);
					}
					else if((popup.getBBox().x + popup.getBBox().width) > (canvas.width - 40)) {
						popup.remove();
						popup = canvas.popup(x, params.y_offset-15, label, "top-right").attr(settings.popup_attr);
					}
					document.body.style.cursor = "pointer";
				}, function() {
					this.attr({r: settings.normal_r});
					label.hide();
					popup.remove();
					document.body.style.cursor = "default";
				});
			
				dots[i].click(function() {
					fclick(proofnode);
					for(var j=0;j<dots.length;j++) {
						dots[j].attr({fill:settings.normal_fill});
					}
					this.attr({fill: settings.highlight_fill});
				});
			})(this, current);
			current = current.next;
		}
		return dots;
	},
	

};

function TimelineHelper() {}

TimelineHelper.highlight = function(dots, index, settings) {
	for(var j=0;j<dots.length;j++) {
		dots[j].attr({fill:settings.normal_fill});
	}
	dots[index].attr({fill: settings.highlight_fill});
};