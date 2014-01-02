function runExample2() {
	$("#place-picker").mappy({
		// Map initialisation options to pass onto Google Maps
		mapOptions: {
			zoom: 15,
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
		
		customPlaces: [
			// North Bar, Leeds
			{
				// flags the user can edit this place
				canEdit: false,
				lat: 53.796592,
				lng: -1.543926,
				// "reference" should be a unique reference in "your system"
				// If the user "selects" this place, this is used to map back to these details
				reference: "sldfkjsdlkfj",
				name: "The Former Bond Street Shopping Centre",
				street: "Albion Street,",
				town: "Leeds",
				area: "West Yorkshire"
			},
			// City Varieties
			{
				// flag that this place should have the tooltip shown when the map is first loaded
				autoShow: true,
				// flags the user can edit this place
				canEdit: false,
				lat: 53.798823,
				lng:-1.5426760000000286,
				reference: "CoQBfAAAAPw-5BTCS53grSLDwX8rwo5BnWnEWnA72lmOjxdgWg2ODGfC5lLjGyoz428IEaln1vJ6rq1jI96Npzlm-N-wmPH2jdJMGfOLxno_rmgnajAnMPzNzuI8UjexIOdHVZPBPvQGloC-tRhudGeKkbdTT-IWNP5hp4DIl4XOLWuYFOVYEhBxNPxaXZdW9uhKIETXf60hGhTc9yKchnS6oO-6z5XZJkK2ekewYQ",
				name: "City Varieties Music Hall",
				url: "https://plus.google.com/103655993956272197223/about?hl=en-GB",
				website: "http://www.cityvarieties.co.uk/",
				telNo: "0845 644 1881",
				street: "Swan Street,",
				town: "Leeds",
				area: "West Yorkshire",
				postCode: "LS1 6LW"
			}
		]
		
	});
}

$(document).ready(function() {
	runExample2();
});

