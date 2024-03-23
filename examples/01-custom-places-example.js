function runExample1() {
    $("#custom-places").mapsed({
		showOnLoad:
		[
			// City Varieties
			{
				// flag that this place should have the tooltip shown when the map is first loaded
				autoShow: true,
				// flags the user cannot edit or delete this place
				canEdit: false,
				canDelete: false,
				lat: 53.798823,
				lng:-1.5426760000000286,
				place_id: "ChIJQd3IwBtceUgRha6laiANoro"
			},
			// Random made up CUSTOM place
			{
				// flag that this place should have the tooltip shown when the map is first loaded
				autoShow: true,
				lat: 53.79,
				lng:-1.5426760000000286,
				name: "Somewhere",
				street: "Over the rainbow, Up high way",
				userData: 99
			}

		]

	});
}


$(document).ready(function() {
	runExample1();
});


