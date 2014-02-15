function runExample4() {
    $("#delete-places").mapsed({
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
				postCode: "LS1 6LW",
				userData: 99
			}
		],
		
		// Allows the user to delete a "custom" place they've previously 
		// ... added
		onDelete: function(m, placeToDelete) {
			m.showMsg(
				"YOUR DELETE CODE HERE",
				"<strong>" + placeToDelete.name + "(" + placeToDelete.userData + ")</strong> has been removed."
			);
			
			// here would be code your application to do the actual delete
			
			// return true to confirm it was deleted OK and remove marker from the map
			// return false if the delete failed
			return true;
		},
		
		// Flag that we want the user to confirm the delete before we actually do it
		confirmDelete: true
				
	});
	
}


$(document).ready(function() {
	runExample4();
});


