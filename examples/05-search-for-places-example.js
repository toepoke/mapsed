function runExample5() {
    $("#search-for-places").mapsed({
		// Adds a predictive search box
		searchOptions: {
			enabled: true,
			//initSearch: "Football in Leeds",
			geoSearch: "Hotels near {POSITION}",
			placeholder: "Search ..."
		},
		
		// Turn on geo location button
		allowGeo: true,
		findGeoOnLoad: true,

		// allow user to select somewhere
		onSelect: function(m, details) {
			var msg = 
				"name: " + details.name +
				"<br/>street: " + details.street + ", " + 
					details.area + ", " + 
					details.town + ", " + details.postCode + 
				"<br/>telNo: " + details.telNo + 
				"<br/>website: " + details.website + 
				"<br/>g+: " + details.url
			;
			m.showMsg("You selected ...", msg);
			// indicate tip should be closed
			return true;
		},
		
		// shows additional instructions to the user	
		getHelpWindow: function(m) {
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
		}
		
	});

}


$(document).ready(function() {
	runExample5();
});

	
