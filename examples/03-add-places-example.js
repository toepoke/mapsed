function runExample1() {
    $("#add-places").mapsed({

		// Adds the "+" button to the control bar at the top right of the map
		allowAdd: true,
		
		// Enables edit of custom places (to your web application, not Google Maps!)
		// ... again the presence of the callback enables the functionality
		onSave: function(m, newPlace) {
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
				if (newPlace.markerType == "new") {
					// simulate a primary key being save to a db
					newPlace.userData = parseInt(Math.random() * 100000);
				}

				var title = "";
				var msg = 
					"userData: " + newPlace.userData + 
					"<br/>name: " + newPlace.name +
					"<br/>street: " + newPlace.street + ", " + 
						newPlace.area + ", " + 
						newPlace.town + ", " + newPlace.postCode + 
					"<br/>telNo: " + newPlace.telNo + 
					"<br/>website: " + newPlace.website + 
					"<br/>g+: " + newPlace.url
				;
				if (newPlace.markerType == "new")
					title = "New place added!";
				else
					title = "Place saved!";
				m.showMsg(title, msg);
			}
		
			// indicate form was OK and saved
			return "";
		}
				
	});
}


$(document).ready(function() {
	runExample1();
});

