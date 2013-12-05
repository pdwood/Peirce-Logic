
// describe creates a test 
describe("EG_to_PL test suite", function() {
  // it creates a spec (expectations within are conjoined)
  it("some simple example of EG to PL working", function() {
  	// EG to PL stuff
  	var testNode = PL_Node.PL_to_EG("A&B&C&D|E");
  	testNode = (testNode);
  	var correctSolution = PL_Node.PL_to_EG("A&C|D");
    expect(compare(testNode, correctSolution)).toBe(true);
  });
});