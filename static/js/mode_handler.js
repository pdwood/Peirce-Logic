function ModeHandler(R_overlay,x_offset,y_offset,width,height) {
	this.paper = induce_overlay('mode',x_offset,y_offset,width,height);
	this.R = R_overlay;

	this.LogicMode = {PREMISE_MODE: 0, PROOF_MODE: 1, INSERTION_MODE: 2};
	this.CURRENT_MODE = this.LogicMode.PREMISE_MODE;
	this.PREVIOUS_MODE = this.LogicMode.PREMISE_MODE;

	this.shape = R_overlay.set();
	var box = this.paper.rect(0,0,width,height).attr({'fill':'#DDD',"fill-opacity": 0.7});
	box.parent = this;
	var text = this.paper.text(width/2, 10,"Premise Mode").attr({"font-size":16});
	text.parent = this;
	this.shape.push(box);
	this.shape.push(text);
	this.shape.click(this.OnCLick);
	this.shape.parent = this;

	this.thunk = null;
}

ModeHandler.prototype.ChangeMode = function(mode,thunk) {
	this.PREVIOUS_MODE = this.LogicMode.CURRENT_MODE;
	if (this.thunk) {
		this.thunk.Reset(this.thunk);
	}
	this.thunk = thunk;
	if (mode === this.LogicMode.PREMISE_MODE) {
		this.CURRENT_MODE = this.LogicMode.PREMISE_MODE;
		this.shape.attr({'text':"Premise Mode"});
	}
	if (mode === this.LogicMode.PROOF_MODE) {
		this.CURRENT_MODE = this.LogicMode.PROOF_MODE;
		this.shape.attr({'text':"Proof Mode"});
	}
	if (mode === this.LogicMode.INSERTION_MODE) {
		this.CURRENT_MODE = this.LogicMode.INSERTION_MODE;
		this.shape.attr({'text':"Insertion Mode"});
	}

};

ModeHandler.prototype.OnCLick = function(e) {
	var p = this.parent;
	if(p.CURRENT_MODE===p.LogicMode.PREMISE_MODE || p.CURRENT_MODE===p.LogicMode.INSERTION_MODE)
		this.parent.ChangeMode(this.parent.LogicMode.PROOF_MODE);
};
