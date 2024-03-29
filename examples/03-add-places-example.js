function updateDatabase(m, newPlace) {
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
			"<br/>more: " + newPlace.url
		;
		if (newPlace.place_id) {
			msg += "<br/>Place_id: " + details.place_id
		}
		if (newPlace.markerType == "new") {
			title = "New place added!";
		} else {
			title = "Place saved!";
		}
		m.showMsg(title, msg);
	}
		
	// indicate form was OK and saved
	return "";
}

function runExample3() {
    $("#add-places").mapsed({

		disablePoi: true,

		// Enables edit of custom places (to your web application, not Google Maps!)
		// ... again the presence of the callback enables the functionality
		onSave: function(m, newPlace) {
			return updateDatabase(m, newPlace);
		},
		// Enables saving of new places, also adds the "+" button to the control bar 
		// at the top right of the map
		onAddSave: function(m, newPlace) {
			return updateDatabase(m, newPlace);
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

	});
}


$(document).ready(function() {
	runExample3();
});

