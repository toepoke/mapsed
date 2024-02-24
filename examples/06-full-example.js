
var _myPlaces = [];
var _store = mapsedStorage;

// 
// Map style to use when loading the map
//
var _avocadoStyle = [{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#aee2e0"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#abce83"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#769E72"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#7B8758"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#EBF4A4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#8dab68"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#5B5B3F"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ABCE83"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#A4C67D"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#9BBF72"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#EBF4A4"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#87ae79"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#7f2200"},{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"visibility":"on"},{"weight":4.1}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#495421"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]}];

//
// Some custom themes, outlinging how additional controls can be added
// ... in this example there's a SELECT dropdown list with themes that can be picked
//
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



//
// Theme dropdown change event code, applies the selected theme
//
function onThemeChange(me, mapsed) {
	var themeName = me.val(),
			themeJSON = ""
	;
	
	for (var i=0; i < _snazzyMaps.length; i++) {
		var currTheme = _snazzyMaps[i];

		if (currTheme.name === themeName) {
			// found it, so apply the theme
		    mapsed.getGoogleMap().setOptions({ styles: currTheme.theme });
			break;
		}
	}

} // onThemeChange


// 
// Helper method for displaying the details of a place in this demo.
// 
function getPlaceHtml(details) {
	var html = 
		"UserData:&nbsp;&nbsp;" + details.userData + "<br/><br/>" + 
		"Location:&nbsp;&nbsp;" + details.lat + " / " + details.lng + "<br/><br/>" +
		"Name:&nbsp;&nbsp;" + details.name + "<br/><br/>";
	
	if (details.place_id) {
		html += "place_id:&nbsp;&nbsp;" + details.place_id + "<br/><br/>";
	}

	html +=
		"Address:&nbsp;&nbsp;" + details.street + 
			", " + details.town + 
			", " + details.area + 
			", " + details.postCode + 
			", " + details.country + 
			"<br/><br/>" +
		"website:&nbsp;&nbsp;<a href='" + details.website + "'>website</a><br/>" +
		"more&nbsp;&nbsp;<a href='" + details.url + "'>more page</a><br/>" +
		"Tel:&nbsp;&nbsp;" + details.telNo
	;

	return html;
}



//
// Builds up the mapsed object for the demo, wires up default options and
// event handlers.
// There's quite a lot here as we're illustrating pretty much everything.
// Don't be put off ... you won't need anywhere near this level ... probably :oD
// 
function fullWindowExample(e) {
	_myPlaces = _store.loadAllPlaces();

	e.preventDefault();
	
	$.fn.mapsed({
		// Map initialisation options to pass onto Google Maps
		mapOptions: {
			zoom: 15,
			center: new google.maps.LatLng(51.501364, -0.14189),
			styles: _avocadoStyle
		},

		// Adds a predictive search box
		searchOptions: {
			enabled: true,
			initSearch: "Football near me",
			placeholder: "Search for \"5aside\" ..."
		},

		// Turn geo button on
		allowGeo: true,

		// Emulate places being loaded from a db
		showOnLoad: _myPlaces,

		// Adds the "+" button to the control bar at the top right of the map
		allowAdd: true,
		disablePoi: true,

		// Illustrating custom behaviour
		// ... changing the added marker to have _some_data_
		onAdd: function (m, marker) {
			// note marker has "lat" and "lng" properties to use for querying google maps
			marker.details.name = "Test name";
			marker.details.street = "Test street";
			marker.details.town = "Test town";
			marker.details.area = "Test area";
			marker.details.postCode = "Test postcode";
			marker.details.country = "Test country";
			marker.details.telNo = "Test telNo";
			marker.details.website = "example.com";
			marker.details.url = "http://example.com";
			// pass control back to mapsed
			m.showAddDialog(marker);
		},

		// Enables place selection
		// ... note the presence of the callback is 
		// ... all that's required to enable selection
		onSelect: function (m, details) {
			var msg = getPlaceHtml(details);

			m.showMsg("YOUR SELECTION CODE HERE", msg);

			// indicate tip should be closed
			return true;
		},

		// Defines header and footers to be applied to the 
		// ... select/edit/delete tooltips shown to the user
		templateOptions: {
			// You can have a different header or footer for
			// each "markerType".  Supported customisations are:
			// "custom" - Where your user has previously added a marker
			// "add" - Where your user has click "add" to create a new marker
			// "google" - Where your user has clicked on a marker found via Google Places APi
			custom: {
				view: {
					header: "<center>custom view header</center>",
					footer: "<center>custom view footer</center>",
				},
				edit: {
					header: "<center>custom edit header</center>",
					footer: "<center>custom edit footer</center>"
				}
			},

			add: {
				view: {
					header: "<center>add view header</center>",
					footer: "<center>add view footer</center>",
				},
				edit: {
					header: "<center>add edit header</center>",
					footer: "<center>add edit footer</center>"
				}
			},

			google: {
				view: {
					header: "<center>google view header</center>",
					footer: "<center>google view footer</center>",
				},
				edit: {
					header: "<center>google edit header</center>",
					footer: "<center>google edit footer</center>"
				}
			}

		},

		// Enables edit of new places (to your web application, not Google Maps!)
		// ... again the presence of the callback enables the functionality
		onSave: function (m, newPlace) {
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
				if (!newPlace.userData) {
					// simulate a primary key being save to a db
					newPlace.userData = _store.getNextId();
				}

				_store.savePlace(newPlace);

				var msg = getPlaceHtml(newPlace);
				m.showMsg("YOUR SAVE CODE HERE!", msg);
			}

			// indicate form was OK and saved
			return "";
		},

		// Allows the user to delete a "custom" place they've previously 
		// ... added
		confirmDelete: true,
		onDelete: function (m, placeToDelete) {
			m.showMsg(
				"YOUR DELETE CODE HERE",
				"<strong>" + placeToDelete.name + "</strong> has been removed."
			);

			// here would be code your application to do the actual delete
			_store.deletePlace(placeToDelete);

			// return true to confirm it was deleted OK and remove marker from the map
			// return false if the delete failed
			return true;
		},

		// Custom marker images
		getMarkerImage: function (m, markerType, title) {
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
		getHelpWindow: function (m) {
			var html =
				"<div class='mapsed-help'>" +
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
		showHelpOnLoad: true,

		// Callback for when the user tries to load the map
		onClose: function (mapsed) {
			var closeMap = confirm("Close map?");

			// you can cancel the close of the map by returning false
			return closeMap;
		},

		onMapMoved: function (north, south, east, west) {
			var hits = [];
			console.log("onMapMoved:", north, south, east, west);

			// Mimc back-end search for places within the boundary
			for (var i = 0; i < _sporadic_places.length; i++) {
				var place = _sporadic_places[i];

				var withinLat = (place.lat >= south && place.lat <= north);
				var withinLng = (place.lng >= west && place.lng <= east);

				if (withinLat && withinLng) {
					hits.push(place);
				}
			}

			console.log("Found", hits);
			return hits;
		},

	  // Fired once the mapsed object has initialised, but before the map
		// has been drawn.  If you wish to add custom controls, this is where to do it
		onPreInit: function(mapsed) {
			var html = "",
					$select = null,
					$selectContainer = null
			;

			// add warning about problems with POI being turn off with custom maps
			var poiIs = (this.disablePoi ? "disabled" : "enabled");
			var poiMessage =
				"<br/><div class='mapsed-poi-message'>" +
				"<p>Please note that POI cannot be turned off when using styled maps (poi is <strong>" + poiIs + "</strong>).</p>" +
				"</div>"
			;
			
			// build up the theme picker
			html += "<select id='themePicker' title='Pick an alternative map style...' class='mapsed-control-button'>";
			for (var i=0; i < _snazzyMaps.length; i++) {
				var theme = _snazzyMaps[i];
				html += "<option value='" + theme.name + "'>" + theme.name + "</option>";
			}
			html += "</select>" + poiMessage;


			$selectContainer = mapsed.addMapContainer("<div class='snazzy-container'></div>", google.maps.ControlPosition.BOTTOM_CENTER);

			$select = $(html).appendTo($selectContainer);
			// wire up the change event to pick a new theme
			$select.on("change", function() {
			    onThemeChange($(this), mapsed);
			});

		},
		
		// Fired once the map has completed loading
		onInit: function(m) {
			
		}

	});

}

$(document).ready(function() {
	// wire up examples
	
	// wire up full window example
	$("#show-full-window")
		.on("click", fullWindowExample)
		//.trigger("click")
	;
	
});

