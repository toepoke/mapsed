
function examples_onDelete(mappy, placeToDelete) {
	var msg = "Are you sure you want to delete '" + placeToDelete.name + "'";
	
	return confirm(msg);
}

function examples_onSave(mappy, newPlace) {
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

function examples_onSelect(mappy, details) {
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
}

function examples_getMarkerImage(mappy, markerType) {
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
		size: new google.maps.Size(35, 50),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(17, 34)						
	};
}

function examples_getHelpWindowHtml(mappy) {
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
};
