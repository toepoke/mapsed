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
			if (details.place_id) {
				msg += "<br/>Place_id: " + details.place_id
			}
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
				place_id: "ChIJQd3IwBtceUgRha6laiANoro"
			}
		
	});
}

$(document).ready(function() {
	runExample2();
});

