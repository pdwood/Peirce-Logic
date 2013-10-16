$(document).ready(function(){
    var tour = new Tour({
        debug:true,
	onStart: function(){
	    return $start.addClass("disabled",true);
	},
	onEnd: function(){
	    return $start.removeClass("disabled",true);
	}
    });
    var $start = $("#tourbutton");
    tour.addSteps([
	{
	    title: "Welcome!",
	    content: "Welcome to Peirce Logic.  Let's walk you through the basics of the program.",
	    placement: "bottom",
	    orphan:true
	} , {
	    element: "#ModeLink",
	    title: "Modes",
	    content: "This is the mode button. In Peirce Logic, you start out in Goal Mode. In this mode, you specify the goal of your proof, or what you want to prove.",
	    placement: "top",
	    backdrop:true
	} , {
	    title: "Peirce basics",
	    content: "This is the Plane of Truth. Every statement you put on the plane is true. All separate statements you put on the plane are conjuncted. For our example proof, we want to prove the Peirce equivalent of (A &#8743; B).",
	    orphan:true
	} , {
	    element: "#paper",
	    title: "Add a statement",
	    placement: "left",
	    content: "Since everything on the page is conjuncted, we just have to put the statements A and B on the page. Right click anywhere on the page and select the 'Construction: Variable' option.  Type in 'A' and click 'OK' or press enter.  Right click anywhere else on the page and do the same for 'B'.  We've now completed setting up our goal state.",
	    orphan:true
	} , {
	    element: "#ModeLink",
	    title: "Going to Premise Mode",
	    content: "Now let's go to the next mode: Premise Mode. To do this, click on the mode button once.",
	    reflex: true,
	    placement: "top",
	    backdrop: true
	} , {
	    element: "#paper",
	    title: "Premise Mode",
	    placement: "left",
	    content: "Now we're in Premise Mode. Here we specify our assumptions. For this proof, let's assume the Peirce equivalent of (A &#8743; &#172;&#172 B). Place 'A' on the page in the same way as last time."
	} , {
	    element: "#paper",
	    title: "Cuts",
	    placement: "left",
	    content: "Now for the &#172;&#172 B. In Peirce logic, negations are represented visually as circles, which are called 'cuts.' Everything within a cut is negated, so everything within a cut that is itself within a cut is double negated. In this application, we place the cuts on a page first.  Right click on the page again and select 'Construction: Empty Double Cut.'  Then right click within the cut to place the 'B.'"
	} , {
	    element: "#ModeLink",
	    title: "Going to Proof Mode",
	    content: "Now we're done setting up our assumptions. Let's go to Proof Mode. Click the button again.",
	    backdrop: true,
	    placement: "top",
	    reflex: true
	} , {
	    element: "#paper",
	    title: "Proof Mode",
	    content: "Proof Mode is where we operate on the premises to get to the goal.  We need to eliminate the double negation by getting rid of the two cuts. To do this, right click on the 'B' and select 'Proof: Reverse Double Cut.' Now our proof state is equivalent to our goal state. You're done!",
	    placement: "left"
	    }
    ]);
    $start.click( function(){
	if($start.hasClass("disabled")){
	    return false;
	}
	tour.restart();
    });
});
