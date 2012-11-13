var ModeHandler = function(R_overlay,x_offset,y_offset,width,height) {
	this.paper = induce_overlay('mode',x_offset,y_offset,width,height);
	this.R = R_overlay;

	this.R.LogicMode = {PREMISE_MODE: 0, PROOF_MODE: 1, INSERTION_MODE: 2};
	this.R.CURRENT_MODE = this.R.LogicMode.PREMISE_MODE;
	this.R.PREVIOUS_MODE = this.R.LogicMode.PREMISE_MODE;

	this.R.ChangeMode = this.ChangeMode;

	
	this.shape = this.paper.text(width/2, 3,"Premise Mode");
}

ModeHandler.prototype.ChangeMode = function(mode) {
	if (mode == this.R.LogicMode.PREMISE_MODE) {
		this.R.PREVIOUS_MODE = this.R.LogicMode.CURRENT_MODE;
		this.R.CURRENT_MODE = this.R.LogicMode.PREMISE_MODE;
		this.shape.attr['text'] = 'asdf'
	}

}