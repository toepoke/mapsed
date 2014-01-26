
var _geoPlace = {
	autoShow: true,
	name: "Where I am!"
};


// Some custom places to show when loading the full map, again to illustrate how it's done
var _places = [
	{
		// Buckingham Palace, London
		autoShow: true,
		lat: 51.501, 
		lng: -0.142,
		reference: "CoQBcgAAAF_T0RxbSJXxr_mMPT5axiHj-I3YgOaAf-VG743aipYjqg5ngQ1j_hlopifKvUJ5_jLjDBbqrrU7_Fm97G38g6rWz_B4qJqnotfudUeett4GDijBbFTsgFavFZV-MAyX5igeGMJMH-FFvdD8wsty2RcIfQqbiFyfzeukAxNk6CPzEhB18RgHTLn7rPMVAoMARcSMGhR9Kn1UiOQ8bMVzeJiTC7wLmUx4UA"
	}
	// Sydney Opera House
	,
	{
		autoShow: true,
		lat: -33.85687,
		lng: 151.21528,
		reference: "CoQBdAAAAJIkomAzEkx1f0DZL-wYHDR3p5tTBACdKCI0QswwM8tO8GUWdI_7W0dF7E4uvOD_tvJiJ8yEG1K4_Woflhizsbj5GgmQ4mPovX7pPPjMGH7Yu0pzWzq8_G2MzPKeIzA2XqR_xu8Y2kUby0b4F1NcRVtvNbFS9dVHMW9PPA23zwDREhBtrSpyC9Cg_zeXxmcCH9ujGhQLo7l5BVBiCT4EP7WgHrwLtYxFsw"
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
// Builds up the mappy object for the demo, wires up default options and
// event handlers.
// There's quite a lot here as we're illustrating pretty much everything.
// Don't be put off ... you won't need anywhere near this level ... probably :oD
// 
function fullWindowExample(e) {

	$.fn.mappy({
		// Map initialisation options to pass onto Google Maps
		mapOptions: {
			zoom: 15,
			center: new google.maps.LatLng(51.501364 , -0.14189)
		},

		// Adds a predictive search box
		searchOptions: {
			enabled: true,
			//initSearch: "Football in Leeds",
			placeholder: "Search for \"5aside\" ..."
		},
		
		// Turn geo button on
		allowGeo: true,		
		findGeoOnLoad: true,

		// Emulate places being loaded from a db
		showOnLoad: _places,

		// Enables place selection
		// ... note the presence of the callback is 
		// ... all that's required to enable selection
		onSelect: function(mappy, details) {
			var msg = getPlaceHtml(details);
			
			mappy.showMsg("YOUR SELECTION CODE HERE", msg);
				
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
	
	fullWindowExample();
	
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
				fullWindowExample();
			},
			function (err) {
				// user probably denied us geo access
				alert("Sorry couldn't find you!");
			}
		);
	}
	
});

