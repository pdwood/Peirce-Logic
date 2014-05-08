// on document ready start up all the button hooks
$(document).ready( function() {

	/* ----------------------------------------------------------------------- */
	/* New Button ( clear all proof state )                                    */
	/* ----------------------------------------------------------------------- */
	$("#newButton").click(function () {
		if( confirm( "All unsaved changed will be lost!" )) {
			TheProof.Reset();
			TheProof.Begin();
		} else {
			// Do nothing!
		}
		this.blur();
	});

	/* ----------------------------------------------------------------------- */
	/* Save Button                                                             */
	/* ----------------------------------------------------------------------- */

	// reset titles and what not when we open the modal
	$('#saveButton').click( function( event ) {
		$("#saveFormSubmit").html('Save Proof');
		$("#saveFormSubmit").removeClass("btn-success");
		$("#saveFormSubmit").addClass("btn-primary");
	});

	// run these before submission
	$('#saveFormSubmit').click( function( event ) {

		// tell people that we're trying to save
		$("#saveFormSubmit").removeClass("btn-default");
		$("#saveFormSubmit").addClass("btn-info");
		$("#saveFormSubmit").html('Saving <div id="saveFormSubmitSpinner"></div>');
		$("#saveFormSubmitSpinner").addClass('three-quarters');
		$("#saveFormSubmitSpinner").addClass('three-quarters-save');

		// check to make sure the proof title doesn't already exist in the db
		function checkProofExists() {
			var Dtitle = $("#saveFormTitle").val();
			return $.ajax({
				type: "GET",
				url: "/saveproof",
				data: { title: Dtitle }
			});
		}

		checkProofExists().done( function(r) {
			if(r == 0) {
				var Dtitle = $("#saveFormTitle").val();
				var Ddescription = $("#saveFormDesc").val();
				var Dproof = TheProof.SaveProof();
				$.ajax({
					type: "POST",
					url: "/saveproof",
					data: { title: Dtitle, description: Ddescription, proof: Dproof }
				});
				// tell people that everything went well ( actually this doesn't check
				// to make sure the server got everything good... but for now this is
				// okay )
				$("#saveFormSubmit").removeClass("btn-info");
				$("#saveFormSubmit").addClass("btn-success");
				$("#saveFormSubmit").html('Saved!');
				// wait a bit and close/ cleanup
				setTimeout(function() {
					$("#saveModal").modal('hide');
				}, 750);

			} else {
				$("#saveFormInputGroup").addClass("has-error");
				$("#saveFormTitle").focus();
				var tipProps = {title: "This proof already exists!", placement:"left"};
				$('#saveFormTitle').tooltip(tipProps);
				$('#saveFormTitle').tooltip("show");
				$("#saveFormSubmit").html('Save Proof');
				$("#saveFormSubmit").removeClass("btn-info");
				$("#saveFormSubmit").addClass("btn-primary");
				// clean up the errors
				setTimeout(function() {
					$('#saveFormTitle').tooltip("destroy");
					$("#saveFormInputGroup").removeClass("has-error");
				}, 2000);

			}
		})
		.fail( function(x) {
			D("we failed x:" + x);
		});
	});

	/* ----------------------------------------------------------------------- */
	/* Next and Previous buttons                                               */
	/* ----------------------------------------------------------------------- */
	$('#backwardtick').click(function(e) {
		TheProof.prev();
	});
	$('#forwardtick').click(function(e) {
		TheProof.next();
	});

	/* ----------------------------------------------------------------------- */
	/* Goal state toggle button                                                */
	/* ----------------------------------------------------------------------- */
	var backNode;
	$('#goalbutton').click(function() {
		if ($(this).attr('value') == 'goGoal') {
			backNode = TheProof.current;
			node = TheProof.current;
			while ( node.mode !== Proof.LOGIC_MODES.GOAL_MODE ) {
				node = node.prev;
			}
			TheProof.select(node);
			this.disabled = false;
			this.innerHTML = 'Go Back';
			$(this).attr('value', 'goBack');
			$(this).attr('class', 'btn btn-primary navbar-btn');
		} else {
			TheProof.select(backNode);
			this.disabled = false;
			this.innerHTML = 'See Goal';
			$(this).attr('value', 'goGoal');
			$(this).attr('class', 'btn btn-danger navbar-btn');
		}
		this.blur();
	});


	/* ----------------------------------------------------------------------- */
	/* Load Button                                                             */
	/* ----------------------------------------------------------------------- */
	$('#loadButton').click( function( event ) {
		$('#loadProofSpinner').show();
		function requestUserProofs() {
			return $.ajax({
				type: "GET",
				url: "/loadproof",
			});
		}

		requestUserProofs().done( function(r) {
			$('#loadProofSpinner').hide();
			// if there are no proofs
			if(r.length === 0) {
				$('#availableProofs').html('<h1> You have no saved proofs! </h1>');
				return;
			}

			// proofs exist
			// clear the html within the modal
			$('#availableProofs').html('');

			// loop over all proofs inserting them to html
			for( var p = 0; p<r.length; ++p  ) {
				curProof = r[p];
				$('#availableProofs').html( $('#availableProofs').html() +
					'<li class="list-group-item">' +
							'<div class="pull-right">' +
									'<div class="btn-group">' +
											'<button class="btn btn-default btn-xs shadow-blue proof-load">' +
													'<span class="glyphicon glyphicon-folder-open"></span>' +
											'</button>' +
											'<button class="btn btn-danger btn-xs shadow-red">' +
													'<span class="glyphicon glyphicon-trash"></span>' +
											'</button>' +
									'</div>' +
							'</div>' +
							'<strong>'+ curProof.title +'</strong> ' + curProof.description +
					'</li>' +
				'<input type="hidden" id="json" value=\''+ curProof.proof +'\'/>'
				);
			}

			// when these get clicked load the proof
			$('.proof-load').click( function( event ) {
				var proofData = $(this).parent().parent().parent().parent().find('#json').val();
				TheProof.LoadProof(proofData);
				$("#loadModal").modal('toggle');
			});

		})
	});


	/* ----------------------------------------------------------------------- */
	/* Derek's temp button                                                     */
	/* ----------------------------------------------------------------------- */
	$('#tempButton').click( function( event ) {
			TheProof.var_list();
	});

	/* ----------------------------------------------------------------------- */
	/* Button Comment Template                                                 */
	/* ----------------------------------------------------------------------- */



});
