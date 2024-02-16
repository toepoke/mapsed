
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

		return value;
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

