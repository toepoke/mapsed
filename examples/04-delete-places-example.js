function runExample4() {
	$("#delete-places").mappy({
		showOnLoad: [
			// City Varieties
			{
				autoShow: true,
				canEdit: true,
				lat: 53.798823,
				lng:-1.5426760000000286,
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
		
		// Allows the user to delete a "custom" place they've previously 
		// ... added
		onDelete: function(mappy, placeToDelete) {
			var msg = "About to delete " + placeToDelete.name + "\n\nAre you sure?";

			// confirm delete ... this could be a js confirm if you want confirmation
			return confirm(msg);
		}
				
	});
	
}


$(document).ready(function() {
	runExample4();
});


