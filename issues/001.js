

// Some custom places to show when loading the full map, again to illustrate how it's done
var _places = [
	// Random made up CUSTOM place
	{
		// Flag this place can edited (tooltip has an "Edit" button)
		// Once editing has completed a callback is fired so you can save the details to your DB
		autoShow: true,
		lat: 53.79,
		lng: -1.59,
		name: "Somewhere",
		street: "Over the rainbow, Up high way",
		userData: 99
	}	
];


// 
// Helper method for displaying the details of a place in this demo.
// 
function getPlaceHtml(details) {
	var html = 
		"UserData:&nbsp;&nbsp;" + details.userData + "<br/><br/>" + 
		"Location:&nbsp;&nbsp;" + details.lat + " / " + details.lng + "<br/><br/>" +
		"Name:&nbsp;&nbsp;" + details.name + "<br/><br/>" +
		"Address:&nbsp;&nbsp;" + details.street + 
			", " + details.town + 
			", " + details.area + 
			", " + details.postCode + 
			"<br/><br/>" +
		"website:&nbsp;&nbsp;<a href='" + details.website + "'>website</a><br/>" +
		"g+&nbsp;&nbsp;<a href='" + details.url + "'>google+ page</a><br/>" +
		"Tel:&nbsp;&nbsp;" + details.telNo
	return html;
}


//
// Builds up the mapsed object for the demo, wires up default options and
// event handlers.
// There's quite a lot here as we're illustrating pretty much everything.
// Don't be put off ... you won't need anywhere near this level ... probably :oD
// 
function showMap(e) {

	$("#myMap").mapsed({
		// Map initialisation options to pass onto Google Maps
		mapOptions: {
			zoom: 15,
			center: new google.maps.LatLng(51.501364 , -0.14189)
		},

		// Adds a predictive search box
		searchOptions: {
			enabled: true,
			//initSearch: "Football in Leeds",
			placeholder: "Search for \"5aside\" ...",
			geoSearch: "Businesses near {POSITION}"
		},
		
		// Turn geo button on
		allowGeo: true,		
		findGeoOnLoad: true,

		// Emulate places being loaded from a db
		showOnLoad: _places,
		
		getMarkerImage: function(m, markerType, title) {
			if (title === "Here I am!") {
				return {
					url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%8A%95|fff999|000000|",
					size: new google.maps.Size(21, 34)					
				};
			}
			
			// not fussed about the others, just use the default
			return null;
		},

		// Enables place selection
		// ... note the presence of the callback is 
		// ... all that's required to enable selection
		onSelect: function(m, details) {
			var msg = getPlaceHtml(details);
			
			m.showMsg("YOUR SELECTION CODE HERE", msg);
				
			// indicate tip should be closed
			return true;
		},
		
		
	});

}

$(document).ready(function() {			
	// show the map initially without geo location
	// this way
	// 1: We have a map on-screen whilst the user decides if they want to enable geo location
	//    Will look weird as you'd have a blank div until the user decides what to do
	// 2: If the browser doesn't support geo, we still have a map
	// 3: If the user decides they don't want to enable geo, they still have a fallback map to play with
	
	showMap();
	
	if (navigator.geolocation) {
		// cool, geo is supported by the browser
		navigator.geolocation.getCurrentPosition( 
			function (geoPos) {
				// cool user has permitted geo tracking
				// create a new "place" for where the user is
				var geoPlace = {
					autoShow: true,
					name: "Here I am!",
					lat: geoPos.coords.latitude,
					lng: geoPos.coords.longitude
				};
				// add additional place to our places array we'll showOnLoad
				_places.push(geoPlace);
				// and show the map
				showMap();
			},
			function (err) {
				// user probably denied us geo access
				alert("Sorry couldn't find you!");
			}
		);
	}
	
});

