var menuitem      = 0;

// open hidden layer
function mopen(id)
{

	// close old layer
	if(menuitem) menuitem.style.visibility = 'hidden';

	// get new layer and show it
	menuitem = document.getElementById(id);
	menuitem.style.visibility = 'visible';

}
// close showed layer
function mclose()
{
	if(menuitem) menuitem.style.visibility = 'hidden';
}