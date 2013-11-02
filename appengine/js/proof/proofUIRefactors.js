
function AddUIReactors(proof) {
	proof.addReactor(proof.EVENTS.CHANGE_MODE, ChangeMode);
	proof.addReactor(proof.EVENTS.ADD_NODE, AddNode);
	proof.addReactor(proof.EVENTS.SELECT_NODE, ChangeNode);
	proof.addReactor(proof.EVENTS.NEXT_NODE, ChangeNode);
	proof.dadReactor(proof.EVENTS.PREVIOUS_NODE, ChangeNode);
}

function ChangeMode(proof) {
	var mode = proof.currentMode;
	var mode_name = "";
	var warning_color = "";
	if (mode === proof.LOGIC_MODES.PREMISE_MODE) {
		mode_name = "Premise Mode";
		warning_color = "label-success";
	}
	if (mode === proof.LOGIC_MODES.PROOF_MODE) {
		mode_name = "Proof Mode";
		warning_color = "label-info";
	}
	if (mode === proof.LOGIC_MODES.INSERTION_MODE) {
		mode_name = "Insertion Mode";
		warning_color = "label-warning";
	}
	if (mode === proof.LOGIC_MODES.GOAL_MODE) {
		mode_name = "Goal Mode";
		warning_color = "label-danger";
	}
	document.getElementById('ModeLink').innerHTML = '<div id="ModeLink" class="col-sm-12 '+ warning_color +'">'+mode_name+'</div>';
}

function AddNode(proof) {
	/*
	if(proof.currentMode !== proof.LOGIC_MODES.GOAL_MODE && proof.currentMode !== proof.LOGIC_MODES.PREMISE_MODE)
		proof.automated_check(proof.current);
		*/
	branches.draw.call(Timeline, proof);		
}

function ChangeNode(proof) {
	minimap.redraw();
}
