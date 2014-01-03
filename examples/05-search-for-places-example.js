function runExample5() {
	$("#search-for-places").mappy({
		// Map initialisation options to pass onto Google Maps
		mapOptions: {
			zoom: 15,
		},

		// Adds a predictive search box
		searchOptions: {
			enabled: true,
			initSearch: "Football in Leeds",
			placeholder: "Search ..."
		},

		// allow user to select somewhere
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
		}
		
	});

}


$(document).ready(function() {
	runExample5();
});

	