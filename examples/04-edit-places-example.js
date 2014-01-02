function runExample4() {
	$("#edit-places").mappy({
		// Map initialisation options to pass onto Google Maps
		mapOptions: {
			zoom: 15,
		},

		customPlaces: [
			// City Varieties
			{
			autoShow: true,
			canEdit: true,
			lat: 53.798823,
			lng:-1.5426760000000286,
			//reference: "CoQBfAAAAPw-5BTCS53grSLDwX8rwo5BnWnEWnA72lmOjxdgWg2ODGfC5lLjGyoz428IEaln1vJ6rq1jI96Npzlm-N-wmPH2jdJMGfOLxno_rmgnajAnMPzNzuI8UjexIOdHVZPBPvQGloC-tRhudGeKkbdTT-IWNP5hp4DIl4XOLWuYFOVYEhBxNPxaXZdW9uhKIETXf60hGhTc9yKchnS6oO-6z5XZJkK2ekewYQ",
			reference: "two",
			name: "CITY Varieties Music Hall",
			url: "https://plus.google.com/103655993956272197223/about?hl=en-GB",
			website: "http://www.cityvarieties.co.uk/",
			telNo: "0845 644 1881",
			street: "Swan Street,",
			town: "Leeds",
			area: "West Yorkshire",
			postCode: "LS1 6LW"
			}
		],
		
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
	runExample4();
});


