window.onload = function () {
    var element = document.getElementById('holder');
    var H = Hammer(element);
    var R = Raphael(0, 0, "100%", "100%"),
        g = R.circle(210, 100, 50).attr({fill: "hsb(.3, 1, 1)", stroke: "none", opacity: .5});
    var start = function () {
        this.ox = this.attr("cx");
        this.oy = this.attr("cy");
        this.animate({r: 70, opacity: .25}, 500, ">");
    },
    move = function (dx, dy) {
        this.attr({cx: this.ox + dx, cy: this.oy + dy});
    },
    up = function () {
        this.animate({r: 50, opacity: .5}, 500, ">");
    };
    R.set(g).drag(move, start, up);
};