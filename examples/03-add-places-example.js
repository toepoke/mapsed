function runExample1() {
	$("#add-places").mappy({

		// Adds the "+" button to the control bar at the top right of the map
		allowAdd: true,
		
		// Enables edit of custom places (to your web application, not Google Maps!)
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
		}
				
	});
}


$(document).ready(function() {
	runExample1();
});

