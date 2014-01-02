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
		
	});

}


$(document).ready(function() {
	runExample5();
});

	