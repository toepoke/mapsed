var _avocadoStyle = [{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#aee2e0"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#abce83"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#769E72"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#7B8758"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#EBF4A4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#8dab68"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#5B5B3F"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ABCE83"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#A4C67D"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#9BBF72"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#EBF4A4"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#87ae79"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#7f2200"},{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"visibility":"on"},{"weight":4.1}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#495421"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]}];

var _snazzyMaps = [
	{
		"name": "Avocado",
		"theme":
			_avocadoStyle
	}
	,
	{	
		"name": "Pale Dawn",
		"theme": 
			[{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"landscape","stylers":[{"color":"#f2e5d4"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"road"},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{},{"featureType":"road","stylers":[{"lightness":20}]}]
	}
	,
	{
		"name": "Blue water",
		"theme":
			[{"featureType":"water","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"landscape","stylers":[{"color":"#f2f2f2"}]},{"featureType":"road","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]}]
	}

];

var _places = [
	// North Bar, Leeds
	{
		// "canEdit" flags that the user can edit the contents of this place
		// once the user has finished editing you will get the "onEditOK" event
		// 
		autoShow: true,
		canEdit: true,
		lat: 53.796592,
		lng: -1.543926,
		// "reference" should be a unique reference in "your system"
		// If the user "selects" this place, this is used to map back to these details
		reference: "one",
		name: "The Former Bond Street Shopping Centre",
		street: "Albion Street,",
		town: "Leeds",
		area: "West Yorkshire"
	},
	// City Varieties
	{
		autoShow: true,
		canEdit: true,
		lat: 53.798823,
		lng:-1.5426760000000286,
		//reference: "CoQBfAAAAPw-5BTCS53grSLDwX8rwo5BnWnEWnA72lmOjxdgWg2ODGfC5lLjGyoz428IEaln1vJ6rq1jI96Npzlm-N-wmPH2jdJMGfOLxno_rmgnajAnMPzNzuI8UjexIOdHVZPBPvQGloC-tRhudGeKkbdTT-IWNP5hp4DIl4XOLWuYFOVYEhBxNPxaXZdW9uhKIETXf60hGhTc9yKchnS6oO-6z5XZJkK2ekewYQ",
		reference: "two",
		name: "CITY Varieties Music Hall",
		url: "https://plus.google.com/103655993956272197223/about?hl=en-GB",
		website: "http://www.cityvarieties.co.uk/",
		telNo: "0845 644 1881",
		street: "Swan Street,",
		town: "Leeds",
		area: "West Yorkshire",
		postCode: "LS1 6LW"
	},
	// No info
	{
		autoShow: true,
		canEdit: false,
		lat: 53.79,
		lng: -1.59,
		reference: "three",
		name: "Somewhere",
		street: "Over the rainbow,"
	}
];

function onThemeChange(me, mappy) {
	var themeName = me.val(),
			themeJSON = ""
	;
	
	for (var i=0; i < _snazzyMaps.length; i++) {
		var currTheme = _snazzyMaps[i];

		if (currTheme.name === themeName) {
			// found it, so apply the theme
			mappy.getGoogleMap().setOptions({styles: currTheme.theme});
			break;
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
		customPlaces: _places,	// see variables.js
		
		// Adds the "+" button to the control bar at the top right of the map
		allowAdd: true,

		// Enables place selection
		// ... note the presence of the callback is 
		// ... all that's required to enable selection
		onSelect: function(mappy, details) {
			var msg = 
				"\nName:\n" + details.name + 
				"\n\nAddress:\n" + details.street + ", " + details.town + ", " + details.area + ", " + details.postCode +
				"\n\nwebsite:\n" + details.website +
				"\n\ng+:\n" + details.url +
				"\n\nTel:\n" + details.telNo						
			;
			if (details)
				alert("You picked:\n" + msg);
			else
				alert("Details could not be found .. probably no 'reference' property available.");
			// indicate tip should be closed
			return true;
		},
		
		// Enables edit of new places (to your web application, not Google Maps!)
		// ... again the presence of the callback enables the functionality
		onSave: function(mappy, newPlace) {
			var missing = [];

			// detect errors starting at bottom
			// ... we only have space for one error at a time, so this way we'll report 
			// ... from the top down
			if (newPlace.postCode === "") missing.push("postcode");
			if (newPlace.street === "")   missing.push("street");
			if (newPlace.name === "")     missing.push("name");

			// anything missing?
			if (missing.length > 0) {
				// return the error message so the callback doesn't progress
				return "Required: " + missing.join();
			}
			
			if (newPlace) {
				var msg = "onSave (" +
					"name: '" + newPlace.name +
					"', street: '" + newPlace.street +
					"', area: '" + newPlace.area +
					"', town: '" + newPlace.town +
					"', postcode: '" + newPlace.postCode + 
					"', telNo: '" + newPlace.telNo + 
					"', website: '" + newPlace.website + 
					"', g+: '" + newPlace.url +
					"')"
				;
				alert(msg);		
			}

			// indicate form was OK and saved
			return "";
		},
		
		// Allows the user to delete a "custom" place they've previously 
		// ... added
		onDelete: function(mappy, placeToDelete) {
			var msg = "Are you sure you want to delete '" + placeToDelete.name + "'";
			
			return confirm(msg);
		},
              		
		// Custom marker images
		getMarkerImage: function(mappy, markerType) {
			var imageUrl = "";
			
			if (markerType == "custom")
				// a place dervied from "your" database
				imageUrl = "examples/images/view-place.png";
			else if (markerType == "new")
				// user has clicked on the add place (+) icon to add a new place
				imageUrl = "examples/images/add-place.png";
			else 
				// normal Google Places result
				imageUrl = "examples/images/google-place.png";
				
			return {
				url: imageUrl,
				size: new google.maps.Size(28, 40),
				origin: new google.maps.Point(0, 0),
				
				// where the little cross-hair appears (on new markers) relative to the image
				anchor: new google.maps.Point(14, 45)
			};
		},
				
		// shows additional instructions to the user		
		getHelpWindow: function(mappy) {
			var html = 
				"<div class='mappy-help'>" +
					"<h3>Find a venue</h3>" +
					"<ol>" +
						"<li>Simply use the <strong>search</strong> box to find a venue in your area.</li>" +
						"<li>On the pop-up, click <strong>Select</strong> to pick a pitch.</li>" + 
					"</ol>" +
					"<h3>New venues</h3>" +
					"<ol>" +
						"<li>Your venue isn't displayed?  Simply click on the map where your pitch is.</li>" +
						"<li>Fill in the details in the dialog.</li>" + 
						"<li>You can drag the marker around to pinpoint the right location.</li>" + 
						"<li>Once you're happy, click the <strong>OK</strong> button</li>" + 
					"</ol>" +
				"</div>"
			;

			return html;
		},
				
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

