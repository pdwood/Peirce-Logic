////////////////////////////////////////////////////////////////////////////////
// Inference rule for adding variables

function ValidateVariable(tree, nodes) {
	if(nodes.length == 1) {
		var node = nodes.first();
		if(node.isLeaf())
			return false;
		return true;
	}
	return false;
}

function AddVariable(tree, nodes, params) {
	var diff = NewDiff();
	D("blah");
	var variable_name = "UNKNOWN";
	if(params && params.variable_name && params.variable_name.length) {
		variable_name = params.variable_name;
	} else {
		var input_name = UIGetVariableName();
		D('This:');
		D(input_name);
		if(input_name && input_name.length) {
			variable_name = input_name;
			D(variable_name);
		}
		else {
			D("Not working or something...");
		}

	}
	if(!params)
		params = {};
	params.variable_name = variable_name;
	
	var parent = nodes.first();
	var child = parent.addLeaf();
	child.addAttribute("label",variable_name);
	diff.additions.push(child);

	return {tree: tree, diff: NodeDiffToIdDiff(diff), params: params};
}

function ApplyVisualAttrs(tree, nodes, diff, attrs, params) {
	var point = PullPointFromParams(params);
	if(!point) return null;

	var variableID = diff.additions[0];
	AddPointToID(point, variableID, attrs);

	var variable = tree.getChildByIdentifier(variableID);
	var label = variable.getAttribute("label");
	var attr = attrs[variableID];
	attr.text = label;
	return {attrs: attrs};
}

function UIGetVariableName() {
	var variable_name = "";
	//setup text initialization
	// smoke.prompt('Enter Variable Name',function(e){
	// 	if(e){
	// 		variable_name = e.replace(/^\s+|\s+$/g,"");
	// 	}
	// 	if(!variable_name.length) { //if not valid string, just white space
	// 		variable_name = "EMPTY VARIABLE";
	// 	}
	// });
	

	/*smoke.quiz("New Variable/Existing Variable", function(e){
		if (e == "New"){
			variable_name = smoke.prompt("Enter Variable Name", function(e) {
				if (e) {
					variable_name = "" + e;
					variable_name = variable_name.replace(/^\s+|\s+$/g,"");
					//D(variable_name);
				}
				else {
					D("blah");
					variable_name = "UNKNOWN VARIABLE";
				}

				}, {
				reverse_buttons: true,
				ok:"OK",
				cancel:"Cancel"
			});
			
		}
		else if (e == "Existing"){
			var list = TheProof.var_list();
			for (i in list) {
				D(list[i]);
			}
		}
	}, {
		button_1: "New",
		button_2: "Existing",
		button_cancel: "Cancel"
	});*/

	bootbox.dialog({
		title: 'Add Variable',
		message: 'New Variable or Existing Variable?',
		buttons: {
			'New': function() {
				bootbox.prompt('Enter new variable name', function(e) {
					if (e === null) {
						variable_name = "UNKNOWN VARIABLE";
					}
					else {
						variable_name = "" + e;
						variable_name = variable_name.replace(/^\s+|\s+$/g,"");
					}
					
				});
				
			},
			'Existing': function() {
				var list = TheProof.var_list();
				for (i in list) {
					D(list[i]);
				}
				
			},
			'Close': function() {}
		}
	});
	D(ReplaceWhitespace(variable_name));
	return ReplaceWhitespace(variable_name);
}
