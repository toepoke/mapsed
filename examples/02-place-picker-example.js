function runExample2() {
    $("#place-picker").mapsed({
		// allow user to select somewhere
		onSelect: function(m, details) {
			var msg = 
				"Name: " + details.name + 
				"<br/>Address: " + 
					details.street + ", " + 
					details.town + ", " + 
					details.area + ", " + 
					details.postCode +
				"<br/>website: " + details.website +
				"<br/>g+: " + details.url +
				"<br/>Tel: " + details.telNo						
			;
			m.showMsg("Place selected!", msg);
			
			// indicate tip should be closed
			return true;
		},
		
		showOnLoad: 
			// City Varieties
			{
				// flag that this place should have the tooltip shown when the map is first loaded
				autoShow: true,
				lat: 53.798823,
				lng:-1.5426760000000286,
				reference: "CoQBfAAAAPw-5BTCS53grSLDwX8rwo5BnWnEWnA72lmOjxdgWg2ODGfC5lLjGyoz428IEaln1vJ6rq1jI96Npzlm-N-wmPH2jdJMGfOLxno_rmgnajAnMPzNzuI8UjexIOdHVZPBPvQGloC-tRhudGeKkbdTT-IWNP5hp4DIl4XOLWuYFOVYEhBxNPxaXZdW9uhKIETXf60hGhTc9yKchnS6oO-6z5XZJkK2ekewYQ"
			}
		
	});
}

$(document).ready(function() {
	runExample2();
});

