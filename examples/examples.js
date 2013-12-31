
function customPlacesExample() {
	// List of places to list on the map on load
	// ... prob derived from a db of some kind
	// ... Note you don't have to supply _all_ the data below (well you _do_ have supply lat/lng!), 
	// ... just what you have available
	var customPlaceExample = $("#custom-places");
	
	customPlaceExample.mappy({
		customPlaces: _roPlaces // see variables.js
	});
}


function placePickerExample() {
	$("#place-picker").mappy({
		customPlaces: _roPlaces,	// see variables.js

		// allow user to select somewhere
		onSelect: examples_onSelect		
	});

}

function placeEditExample() {
	$("#edit-places").mappy({
		customPlaces: _rwPlaces,	// see variables.js
		
		// Enables edit of custom places (to your web application, not Google Maps!)
		// ... again the presence of the callback enables the functionality
		onSave: examples_onSave
				
	});

}

function placeAddExample() {
	$("#add-places").mappy({
		
		// Adds the "+" button to the control bar at the top right of the map
		allowAdd: true,
	
		// Enables edit of custom places (to your web application, not Google Maps!)
		// ... again the presence of the callback enables the functionality
		onSave: examples_onSave
				
	});

}


function placeSearchExample() {
	$("#search-for-places").mappy({
		customPlaces: _roPlaces,// see variables.js
		
		// Adds a predictive search box
		searchOptions: {
			enabled: true,
			initSearch: "Football in Leeds",
			placeholder: "Search ..."
		},
		
		// allow user to select somewhere
		onSelect: examples_onSelect,		

		// Custom marker images
		getMarkerImage: examples_getMarkerImage,
		
		// shows additional instructions to the user
		// ... see "mappy.rendering.js"
		getHelpWindow: examples_getHelpWindowHtml,
		
		// show the help dialog when the map is loaded
		showHelpOnLoad: false
	});

}




$(document).ready(function() {			
	// wire up examples
	customPlacesExample();
	placeAddExample();
	placeEditExample();
	placePickerExample();
	placeSearchExample();	
});