var timeout         = 1000;
var menuitem      = 0;

// open hidden layer
function mopen(id)
{	
	// cancel close timer
	mcancelclosetime();

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

// go close timer
function mclosetime()
{
	closetimer = window.setTimeout(mclose, timeout);
}

// cancel close timer
function mcancelclosetime()
{
	if(closetimer)
	{
		window.clearTimeout(closetimer);
		closetimer = null;
	}
}

// close layer when click-out
document.onclick = mclose; 