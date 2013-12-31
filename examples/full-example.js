function onThemeChange(me, mappy) {
	var themeName = me.val(),
			themeJSON = ""
	;
	
	for (var i=0; i < _snazzyMaps.length; i++) {
		var currTheme = _snazzyMaps[i];

		if (currTheme.name === themeName) {
			// found it, so apply the theme
			mappy.getGoogleMap().setOptions({styles: currTheme.theme});
		}
	}

} // onThemeChange

function fullWindowExample() {
	$.fn.mappy({
		// Map initialisation options to pass onto Google Maps
		mapOptions: {
			zoom: 15,
			styles: _avocadoStyle	// see variables.js
		},

		// Adds a predictive search box
		searchOptions: {
			enabled: true,
			initSearch: "Football in Leeds",
			placeholder: "Search ..."
		},

		// Emulate places being loaded from a db
		customPlaces: _rwPlaces,	// see variables.js
		
		// Adds the "+" button to the control bar at the top right of the map
		allowAdd: true,

		// Enables place selection
		// ... note the presence of the callback is 
		// ... all that's required to enable selection
		onSelect: examples_onSelect,
		
		// Enables edit of new places (to your web application, not Google Maps!)
		// ... again the presence of the callback enables the functionality
		onSave: examples_onSave,
		
		// Allows the user to delete a "custom" place they've previously 
		// ... added
		onDelete: examples_onDelete,
              		
		// Custom marker images
		getMarkerImage: examples_getMarkerImage,
		
		// shows additional instructions to the user		
		getHelpWindow: examples_getHelpWindowHtml,
		
		onClose: function(mappy) {
			var closeMap = confirm("Close map?");

			// you can cancel the close of the map by returning false
			return closeMap;
		},
		
		onPreInit: function(mappy) {
		
			var html = "",
					$select = null,
					$mapContainer = null
			;
			
			// build up the theme picker
			html += "<select id='themePicker' title='Pick an alternative map style...'>";
			for (var i=0; i < _snazzyMaps.length; i++) {
				var theme = _snazzyMaps[i];
				html += "<option value='" + theme.name + "'>" + theme.name + "</option>";
			}
			html += "</select>";

			$select = mappy.addMapControl(html, google.maps.ControlPosition.TOP_RIGHT);
			
			// wire up the change event to pick a new theme
			$select.on("change", function() {
				onThemeChange($(this), mappy);
			});
			
			
			// add warning about problems with POI being turn off with custom maps
			html = "<div><p>Please note that POI cannot be turned off when using styled maps.</p></div>";
			mappy.addMapControl(html, google.maps.ControlPosition.BOTTOM_LEFT);
		},
		
		onInit: function(mappy) {
			
		}
		
		
	});

}



$(document).ready(function() {			
	// wire up examples
	
	// wire up full window example
	$("#show-full-window").on("click", fullWindowExample);	
});