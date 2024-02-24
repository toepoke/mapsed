var _example6_places = [
	{
		canEdit: true,
		lat: 50.0657041,
		lng: -5.713174599999999,
		name: "Land's End",
		street: "Land's End",
	},
	{
		canEdit: false,
		lat: 51.5054564,
		lng: -0.07535649999999999,
		name: "Tower Bridge",
		street: "Tower Bridge Road",
	},
	{
		canEdit: false,
		lat: 58.6373368,
		lng: -3.0688997,
		name: "John o' Groats",
		town: "John o' Groats",
		postCode: "KW1 4YR"
	},
	{
		canEdit: false,
		lat: 27.173891,
		lng: 78.042068,
		name: "Taj Mahal",
		town: "Agra",
		postCode: "282001"
	},
	{
		canEdit: false,
		lat: -25.344490,
		lng: 131.035431,
		name: "Ayers Rock",
		town: "Petermann NT",
		postCode: "0872"
	},
	{
		canEdit: false,
		lat: 21.315603,
		lng: -157.858093,
		name: "Nankastu SC Hawaii Soccer Academy",
		town: "Honolulu",
		postCode: "96826"
	}
];

function runExample7() {
	$("#map-moved").mapsed({

		onMapMoved: function (north, south, east, west) {
			var hits = [];
			console.log("onMapMoved:", north, south, east, west);

			// Mimc back-end search for places within the boundary
			for (var i = 0; i < _example6_places.length; i++) {
				var place = _sporadic_places[i];

				var withinLat = (place.lat >= south && place.lat <= north);
				var withinLng = (place.lng >= west && place.lng <= east);

				if (withinLat && withinLng) {
					hits.push(place);
				}
			}

			if (hits.length > 0) {
				console.log(`"Found ${hits.length}.`, hits);
			}
			return hits;
		}

	});

}


$(document).ready(function () {
	console.clear();
	runExample7();
});

	
