document.addEventListener("touchend", handlerFunction, false);

var mc;

function initHammer() {
	mc = new Hammer(document.getElementById("paper"));
}

function handlerFunction(event) {
	D("touch");
}

