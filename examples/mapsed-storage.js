
// Some custom places to show when loading the full map, again to illustrate how it's done
var _default_places = [
	// City Varieties
	{
		// Flag this place should be shown as tooltip once the map has finished loading
		autoShow: true,
		// "canEdit" flags that the user can edit the contents of this place
		// once the user has finished editing you will get the "onEditOK" event
		canEdit: true,
		lat: 53.798823,
		lng: -1.5426760000000286,
		// The "place_id" is a Google Places reference string 
		// This is used to query Google Places for the details of the marker
		// Useful if you only want to store references rather than a whole place object in your database
		// Note: Google Places CANNOT be edited, only CUSTOM places can (see next place below)
		place_id: "ChIJQd3IwBtceUgRha6laiANoro",
		addInfo:
			"<p>Ordering drinks for the <br/>interval is an idea!</p>",
		userData: 1
	},
	// Random made up CUSTOM place
	{
		// Flag this place can edited (tooltip has an "Edit" button)
		// Once editing has completed a callback is fired so you can save the details to your DB
		canEdit: true,
		lat: 53.79,
		lng: -1.59,
		name: "Somewhere",
		street: "Over the rainbow, Up high way",
		userData: 2
	}
];

// Set of places around the UK in areas that aren't likely to show up when zoomed in
// folllowing a search.  This is so we can test the onMapMoved event which mimics adding 
// "custom" places from a back-end database.
var _sporadic_places = [
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

var mapsedStorage = {

	/**
	 * Gets a place definition from local storage for the given identifier.
	 * @param {any} key - Id of the place to get
	 * @returns - Place definition (in JSON format)
	 */
	getPlace: function(key) {
		var value = localStorage.getItem(key);
		var place = JSON.parse(value);

		return place;
	},


	/**
	 * Deletes a place definition from local storage.
	 * @param {any} placeToDelete - Id of the place key to delete
	 */
	deletePlace: function(placeToDelete) {
		var key = placeToDelete.userData;

		if (window.localStorage.getItem(key)) {
			window.localStorage.removeItem(key);
		}
	},


	/**
	 * Saves a place to local storage, returning an allocated identifier.
	 * @param {any} savedPlace - JSON definition for the place.
	 * @returns Identifier for the place (used to manipulating later)
	 */
	savePlace: function(savedPlace) {
		if (!savedPlace.userData) {
			savedPlace.userData = this.getNextId();
		} else {
			this.deletePlace(savedPlace);
		}

		var key = savedPlace.userData;
		var value = JSON.stringify(savedPlace);
		window.localStorage.setItem(key, value);

		return savedPlace;
	},


	/**
	 * Helper to get a unique key for a new place.
	 * @returns - Id to be used for a new place definition.
	 */
	getNextId: function() {
		var nextId = 0;

		for (var i = 0, len = window.localStorage.length; i < len; ++i) {
			var key = parseInt(localStorage.key(i));
			if (key > nextId) {
				nextId = key;
			}
		}

		nextId += 1;

		return nextId;
	},


	/**
	 * Loads _all_ custom places saved in local storage as JSON
	 * documents.
	 * @returns
	 */
	loadAllPlaces: function() {
		var places = [];

		if (window.localStorage.length == 0) {
			// Local storage is empty so initialise with the default set of places
			for (var i = 0, len = _default_places.length; i < len; ++i) {
				var place = this.savePlace(_default_places[i]);
				places.push(place);
			}
			return places;
		}

		// Some already saved, so read them out
		for (var i = 0, len = window.localStorage.length; i < len; ++i) {
			var key = localStorage.key(i);
			var place = this.getPlace(key);
			places.push(place);
		}

		return places;
	}

};

