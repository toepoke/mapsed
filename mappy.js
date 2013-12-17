/*
 * Developed by : www.toepoke.co.uk
 *
 * If you redistribute this file, please keep this section in place.
 *
 * License: Same as jQuery - see http://jquery.org/license
 *
 * Resources:
 * 	Places API: 
 * 		https://developers.google.com/maps/documentation/javascript/places
 * 	Places searchbox example: 
 * 		https://google-developers.appspot.com/maps/documentation/javascript/examples/full/places-searchbox
 * 		https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
 *	Draggable layers:
 *		https://developers.google.com/maps/documentation/javascript/markers#symbols
 * Misc:
 * 		http://blog.shamess.info/2009/09/29/zoom-to-fit-all-markers-on-google-maps-api-v3/
 * 
*/

// http://maps.googleapis.com/maps/api/js?key=AIzaSyBWONbNELZvdD2Sq8c0Qd0B69b9NjT4NyA&libraries=geometry,places,drawing&v=3.7&sensor=true

/*
	ToDo:
		(DONE) Full screen (or window version - with resize support)
		(DONE) X at the top right when in full window
		Geo location malarkey
		(SKIP) Remove jQuery dependence?
		(DONE) Change "markerUrl" parameter to a "create marker" override (with default of null)
		Loading gif when loading places in the textbox
		(DONE) Merge custom loaded places with searched ones
*/

(function () {
	// singleton here (same variable across all instances of the plug-in)
	var _version = '(0.0.1)';
	var _plugInName = "mappy";
	var _plugInInstances = 1;

	$.fn.mappy = function (options) {
		// private variables
		var _plugIn = this;           // Reference back to the "mappy" plug-in instance
		var _searchBox = null;        // Search box that appears on the map
		var _gMap = null;             // Underlying Google maps object for the div
		var _mapContainer = null;     // jQuery reference to the DIV the map is in
		var _tooltip = null;          // Reference to the tooltip which appears when a place/marker is clicked
		var _placesApi = null;        // Reference to the Google Places API object
		var _places = [];             // Places in the current result set
		var _markers = [];            // Set of markers displayed on the map
		var _instance = -1;           // Instance "this" plug-in is managing (so we can support multiple maps on the page)
		var _newMarker = null;        // Marker for "new places" (if enabled - see "onAddOK")
		var _fullWin = false;         // Flags "mappy" is in full-window mode, which means "mappy" created the DIV we're in
		var gm = null;                // Short cut reference to the Google Maps namespace (this is initialised in the constructor to give the Google API time to load on the page)
		var gp = null;                // Short cut reference to the Gooele Places namespace (this is initialised in the constructor to give the Google API time to load on the page)

		// Stores what's being added in the "new place" tooltip. Required to keep the state if the 
		// user moves the marker to get a better position of the "place" being defined.
		var _newPlace = {
			reset: function() {       
				this.name = "";       
				this.street = "";     
				this.town = "";
				this.area = "";
				this.telNo = "";
			}
		};

		// Set of options to configure how the map will behave
		var settings = $.extend({
			// Array of places to show on the map initially
			customPlaces: null,
			
			// Options for drawing the map.  This is the same object
			// that is passed to the Google Maps API so if you need something
			// custom supported by Google Maps it should work OK.
			// This is passed to the Google Maps API when the map is first created
			mapOptions: {
				// Initial zoom level
				zoom: 10,
				
				// Default to the best theatre ever :-)
				center: new google.maps.LatLng(53.798822, -1.542799),

				// Type of map to show initially
				mapTypeId: google.maps.MapTypeId.ROADMAP
			},
						
			searchOptions: {
				// Flags that the user can search (add search box to the map)
				enabled: false,
				
				// Placeholder text for the search box
				placeholder: "e.g. Hotels in Leeds",

				// Initialises the place search with a given text search
				// ... (i.e. once the map has been created, the results for this string are also shown)
				initSearch: "Hotels in Leeds"
			},
				
			// Event when user clicks the "Select" button
			// prototype: function(mappy, details)
			onSelect: null,
			
			// Event fires when user clicks the "X" button (only in full window mode)
			// prototype: function(mappy)
			// 	return true to close the map, false keeps it open
			onClose: null,
			
			// Allows new places to be added
			// prototype: function(mappy, newPlace)
			onAddOK: null,
				
		}, options || {});
		
		// Sample public method
		this.myPublic = function() {
			return 0;
		};
		
		this.getSettings = function() {
			return settings;
		};
		
		this.getGoogleMap = function() {
			return _gMap;
		};

		this.newMarkerClickEvent = function(marker) {
			var mappy = this;
			
			if (marker.markerType == "new") {
				// added by user, so prompt for details
				var html = mappy.getEditMarkerHtml(marker);
				_tooltip.setContent(html);
				_tooltip.open(_gMap, marker);
				return;
			}
		
		};
		
		this.markerClickEvent = function(marker) {
			var mappy = this;

			if (marker.details.isLoaded) {
				// already been populated, likely the place details have been supplied
				// by the caller, so that wins.  just show the tooltip with the details we have
				var html = mappy.getTooltipHtml(marker.details);
				_tooltip.setContent(html);
				_tooltip.open(_gMap, marker);
			} 
			else if (marker.details && marker.details.reference && marker.details.reference.length > 0) {
				var request = {
					reference: marker.details.reference
				};				
				_placesApi.getDetails( request, 
					function(placeDetails, status) {
						if (status != gp.PlacesServiceStatus.OK)
							return;
						marker.details = placeDetails;
						var currPlace = marker.details; 
						// store for later (if the place is selected so we can return the details)
						_places[marker.details.reference] = currPlace;
						currPlace = marker.details;
						// flag we have the full details
						currPlace.isLoaded = true;
						
						// our format is a bit different
						currPlace.lat = placeDetails.geometry.location.lat();
						currPlace.lng = placeDetails.geometry.location.lng();						
						
						var html = mappy.getTooltipHtml(marker.details);
						_tooltip.setContent(html);
						_tooltip.open(_gMap, marker);
					}
				);		
			}			
		}
		
		this.mapClickEvent = function(evt) {
			if (!settings.onAddOK)
				// not turned on
				return;
				
			var mappy = this;
			if (_newMarker) {
				// already added, so clear current location and apply new position
				_newMarker.setMap(null);
				_newMarker.setPosition(evt.latLng);
				_newMarker.setMap(_gMap);
				_gMap.panTo(_newMarker.position);
				// and show
				_plugIn.newMarkerClickEvent(_newMarker);
				return;
			}
				
			var position = evt.latLng;
			_newMarker = createMarker("new one", 
				position, 
				true/*draggable*/, 
				"new"	// being created by the user
			);
			
			// reset the edit variable
			_newPlace.reset();
			
			_gMap.panTo(position);
			
			gm.event.addListener(_newMarker, "click", function() {
				_plugIn.newMarkerClickEvent(this);
			});
			_plugIn.newMarkerClickEvent(_newMarker);
		}
		
		
		
		var _firstSearch = true;
		// Sample private method
		// fires when user selects an item from the pick list
		var placeSelected = function(places) {
			if (!_firstSearch) {
				// If we're pre-populated the map with (via "customPlaces" setting)
				// and put some results up on start-up (via the "initSearch" option)
				// we don't want to clear the markers as we'll remove the "customPlaces"
				// we've added
				clearMarkers(); 
				_places = [];
			}
			_firstSearch = false;

			if (places == null || places == undefined) 
				// if "initSearch" is used on startup, "places"
				// is populated, but if it's done via the "searchBox" object
				// we have to ask .. so this covers both!?!??!
				places = _searchBox.getPlaces();

			// For each place, get the icon, place name, and location.
			var bounds = new gm.LatLngBounds();
			for (var i = 0, place; place = places[i]; i++) {
				var marker = createMarker(
					place.name,
					place.geometry.location,
					false/*draggable*/,
					"google"
				);

				// associate the place with the marker
				marker.details = place;
				// our format is a bit different
				marker.details.lat = place.geometry.location.lat();
				marker.details.lng = place.geometry.location.lng();						
				_markers.push(marker);

				bounds.extend(place.geometry.location);
				
				gm.event.addListener(marker, "click", function() {
					_plugIn.markerClickEvent(this);
				});
			}

			_gMap.fitBounds(bounds);
		};
		
		// zoom in/out
		var boundsChanged = function() {
			var bounds = _gMap.getBounds();
			_searchBox.setBounds(bounds);
		};
		
		var addSearchButton = function() {
			var id = "mappy-search-button-" + _instance;
			var btn = document.getElementById(id);
			
			if (!btn) {
				// create the "search" button and add to document (in body)
				var body = document.getElementsByTagName("body")[0];
				var btn = document.createElement("input");
				btn.setAttribute("id", id);
				btn.setAttribute("placeholder", "Search ...");
				if (settings.searchOptions.enabled && settings.searchOptions.placeholder) {
					btn.setAttribute("placeholder", settings.searchOptions.placeholder);
				}
				btn.setAttribute("class", "controls searchbox");
				btn.setAttribute("autocomplete", "off");
				if (settings.searchOptions.enabled && settings.searchOptions.initSearch) {
					btn.setAttribute("value", settings.searchOptions.initSearch);
				}
				body.appendChild(btn);
				
				// associate with places api
				// ... note Google Maps API doesn't play well with jQuery
				//_searchBox = new gp.Autocomplete(btn);
				_searchBox = new gp.SearchBox(btn);
				// Place search box onto the screen
				_gMap.controls[gm.ControlPosition.TOP_LEFT].push(btn);
				
				// and wire up the callback when a user selects a hit
				gm.event.addListener(_searchBox, "places_changed", placeSelected);
				// and again for when they zoom in/out
				gm.event.addListener(_gMap, "bounds_changed", boundsChanged);
			}
			
		};
		
		
		/// <summary>
		/// When in full window mode we need a close button so they can exit
		/// if they wish.
		/// </summary>
		var addCloseButton = function() {
			var id = "mappy-close-button-" + _instance;
			var btn = document.getElementById(id);
			
			if (!btn) {
				// create the "close" button and add it to the doc body
				var btnHtml = $(
					"<div class='mappy-close-container'>" + 
						"<a href='#' class='mappy-close-button' id='" + id + "'>X</a>" +
					"</div>"
				);
				btn = btnHtml.appendTo("body");

				// add tell gmaps where to place it
				_gMap.controls[gm.ControlPosition.TOP_RIGHT].push(btn[0]);
				
				gm.event.addDomListener(btn[0], 'click', function() {
					var closeMap = true;
					if (settings.onClose) {
						closeMap = settings.onClose(_plugIn);
					}
					if (closeMap) {
						// just kill the DIV container and Google object
						_gMap = null;
						// close if only available if we created the DIV and we're in full screen mode
						// so kill off the DIV and remove
						_mapContainer.remove();
					}
					// else 
					// nothing to do, leave map in place as it was					
				});
			}
		
		};
		
		
		var clearMarkers = function() {
			if (_markers && _markers.length > 0) {
				for (var i = 0; i < _markers.length; i++) {
					var currMarker = _markers[i];
					currMarker.setMap(null);
				}
			}
			
			_markers = [];
			if (_tooltip) 
				_tooltip.close();
		};
		
		var createMarker = function(title, latLon, isDraggable, type) {
			var image = null;

			if (settings.getMarkerImage) {
				image = settings.getMarkerImage(this, type);
			}
			
			var marker = new gm.Marker({
				map: _gMap,
				icon: image,
				title: title,
				animation: gm.Animation.DROP,
				position: latLon,
				markerType: type,
				draggable: isDraggable
			});
			
			return marker;
		};
		
		var addCustomPlaces = function() {
			var placeDetails = [];
			var bounds = new gm.LatLngBounds();
			
			_places = [];
			clearMarkers();
			
			for (var i=0; i < settings.customPlaces.length; i++) {
				var p = settings.customPlaces[i];
				var pos = new gm.LatLng(p.lat, p.lng);
				var marker = createMarker("", pos, false/*draggable*/, "custom");
								
				marker.details = p;
				// mark as loaded so we don't try and fetch from Google places and overwrite them
				marker.details.isLoaded = true;
				if (p.reference && p.reference.length > 0) {
					// take a copy of the details we have in case the place gets "selected"
					_places[p.reference] = p;
				}
				
				_markers.push(marker);
				bounds.extend(pos);
				
				// hookup onclick
				gm.event.addListener(marker, "click", function() {
					_plugIn.markerClickEvent(this);
				});
			}
				
			// we done?
			_gMap.fitBounds(bounds);
		};


		var ctor = function() {
			var containerId = null;

			// Set up Google API namespace references
			gm = google.maps;
			gp = google.maps.places;

			containerId = _mapContainer.attr("id");
			_gMap = new gm.Map( 
				document.getElementById(containerId), 
				settings.mapOptions
			);
			_placesApi = new gp.PlacesService(_gMap);
			_tooltip = new gm.InfoWindow();
			_instance = _plugInInstances++;
			
			if (settings.onSelect) {
				_mapContainer.on("click", "button.mappy-select-button", function() {
					var reference = "";
					var details = null;
					var tipRoot = $(this).parents("table");
					var refCtrl = tipRoot.find(".mappy-reference");
					if (refCtrl.length) {
						reference = refCtrl.val();
						details = _places[reference];	
					}

					if (settings.onSelect(_plugIn, details)) {
						_tooltip.close();
					}

				});
			}
			if (settings.onAddOK) {
				_mapContainer.on("click", "button.mappy-save-button", function() {
					var ctx = $(this).parent();
					
					_newPlace.name   = ctx.find("#mappy-name").val();
					_newPlace.street = ctx.find("#mappy-street").val();
					_newPlace.town   = ctx.find("#mappy-town").val();
					_newPlace.area   = ctx.find("#mappy-area").val();
					_newPlace.telNo  = ctx.find("#mappy-telno").val();
					
					if (settings.onAddOK(_plugIn, _newPlace)) {
						_tooltip.close();
						// reset now it's been saved
						_newPlace.reset();
					}

				});
			}
			
			if (settings.searchOptions.enabled) {
				addSearchButton();
			}
			if (_fullWin) {
				addCloseButton();
			}
			if (settings.customPlaces != null) {
				addCustomPlaces();
			}
			
			gm.event.addListener(_gMap, "click", function(evt) {
				_plugIn.mapClickEvent(evt);
			});
			
			if (settings.searchOptions.enabled && settings.searchOptions.initSearch.length > 0) {
				var request = {
					query: settings.searchOptions.initSearch					
				};
				_placesApi.textSearch(request, placeSelected);
			}
		};
		
		var dtor = function() {
			
		
		};
		
		
		
		//
		// PLUG-IN initial w
		//
				
		this.each(function () {
			_mapContainer = $(this);
			
			ctor();

		}); // each
		
		// fall back to create a div and show full screen
		if (!this.length) {
			var mapId = "mappy-full-window";
			// see if we've already added one
			var _mapContainer = $("#" + mapId);			
			if (!_mapContainer.length) {
				_mapContainer = $("<div id='mappy-full-window' class='mappy-full-window'></div>");
				_mapContainer.appendTo("body");
			}
			// flag we're in full window mode
			_fullWin = true;
			ctor();				
		}
		
		this.defaultSaveEvent = function(newPlace) {
			console.log("name: ",newPlace.name);
			console.log("street: ",newPlace.street);
			console.log("area: ",newPlace.area);
			console.log("town: ",newPlace.town);
			console.log("telNo: ",newPlace.telNo);
			
			// flag tip should be closed
			return true;
		};
		
		this.getEditMarkerHtml = function(marker) {
			var html = 
				"<div class='mappy-address-entry'>" +
					"<h1>Place details:</h1>" +
						"<ul>" +
							"<li>" + 
								"<label for='mappy-name'>Name</label>" + 
								"<input id='mappy-name' type='text' placeholder='e.g. Bob sandwich shop' value='" + _newPlace.name + "' />" + 
							"</li>" +
							"<li>" + 
								"<label for='mappy-street'>Street</label>" + 
								"<input id='mappy-street' type='text' placeholder='e.g. 3 Hemington place' value='" + _newPlace.street + "' />" + 
							"</li>" +
							"<li>" + 
								"<label for='mappy-town'>Town</label>" + 
								"<input id='mappy-town' type='text' placeholder='e.g. Leeds' value='" + _newPlace.town + "' />" + 
							"</li>" +
							"<li>" + 
								"<label for='mappy-area'>Area</label>" + 
								"<input id='mappy-area' type='text' placeholder='e.g. West Yorkshire' value='" + _newPlace.area + "' />" + 
							"</li>" +
							"<li>" + 
								"<label for='mappy-telno'>Tel No</label>" + 
								"<input id='mappy-telno' type='telephone' placeholder='contact telephone number' value='" + _newPlace.telNo + "' />" + 
							"</li>" +
						"</ul>" +
					"<button class='mappy-save-button'>OK</button>" +
				"</div>";	// mappy-address-entry
			return html;
		};

		this.getTooltipHtml = function(details) {
			var html = "", butHtml = "";
			var settings = _plugIn.getSettings();
			var hasPhoto = (details && details.photos && details.photos.length > 0);
			var has2Cols = (hasPhoto || settings.onSelect);

			// where the button is added depends on whether a photo is available or not
			// ... so resolve that now
			if (settings.onSelect) {
				butHtml +=	"<button class='mappy-select-button'>Select</button>";
			}

			// tables!, yes I know, I know.  In my defence "proper" CSS 
			// proved to be too unreliable when used with map tooltips!
			html +=	"<table class='mappy-container'>";
			html +=		"<tr><td " + (has2Cols ? " colspan='2'" : "") + ">";
			html +=		_plugIn.renderHeading(details);
			html += 	"</td></tr>"
			html +=     "<tr>";
			html +=			"<td class='mappy-left'>";
			html +=				_plugIn.renderAddressHtml(details);
			html +=				_plugIn.renderPhone(details);
			html += 			_plugIn.renderWebsite(details);
			html +=			"</td>"; // mappy-left
			if (hasPhoto) {
				html +=	"<td class='mappy-right'>";
				html += 	_plugIn.renderPhotoHtml(details);
				html += 	"<br/>" + butHtml
				html += "</td>"; // mappy-right
			} else {
				if (settings.onSelect) {
					html +=	"<td class='mappy-right'>";
					// no photo, so button underneath
					html += butHtml;
					html += "</td>"; // mappy-right
				}
			}
			html +=		"</tr>";
			html +=	"</table>";	// mappy-container

			return html;
		};
		
		
		/// <summary>
		///
		/// </summary>
		this.renderPhone = function(details) {
			var html = "";
			
			if (details && details.formatted_phone_number && details.formatted_phone_number.length > 0) {
				html 
					+="<a class='telno' href='tel:" 
					+ details.formatted_phone_number 
					+ "'>" 
					+ details.formatted_phone_number 
					+ "</a>"
					+ "<br/>"
				;
			}
			
			return html;
		};
		
		/// <summary>
		///
		/// </summary>
		this.renderHeading = function(details) {
			var html = "";
			
			if (details && details.name) {
				var shortName = details.name;
				if (shortName.length > 20)
					shortName = shortName.substring(0, 20) + " ...";
				html += "<h1>" + shortName + "</h1>";
			}
			
			if (details && details.reference) {
				// add the place reference
				html += "<input type='hidden' "
					+ "class='mappy-reference' "
					+ "value='" + details.reference 
					+ "' />"
					
				// add lat/lng position
				html += "<input type='hidden' class='mappy-lat' value='" + details.lat + "' />";
				html += "<input type='hidden' class='mappy-lng' value='" + details.lng + "' />";
				;
			}
			
			return html;
		};
		
		/// <summary>
		///
		/// </summary>
		this.renderWebsite = function(details) {
			var html = "";
		
			if (details && details.website && details.website.length > 0) {
				var shortVersion = details.website;
				shortVersion = shortVersion
					.replace("http://", "")
					.replace("https://", "")
					.replace("www.", "")
				;
				if (shortVersion[shortVersion.length-1] == "/")
					// strip trailing slashes
					shortVersion = shortVersion.substring(0, shortVersion.length-1);
				if (shortVersion.length > 20)
					// too long, just use the name
					shortVersion = details.name + " website";
				html += "<a href='" + details.website + "'>website</a>";
				
				if (details.url && details.url.length > 0) {
					// has google+ too
					html += "&nbsp;<a href='" + details.url + "'>g+</a>";
				}
			}
		
			return html;
		};
		
		
		// <summary>
		// Convenience function for finding parts of the address
		// </summary>
		function findPart(addressParts, typeName, getShortVersion) {
			if (addressParts == null || addressParts.length == 0) 
				// address not available
				return "";
				
			var value = "";

			for (var i=0; i < addressParts.length; i++)  {
				var item = addressParts[i];
				var found = false;
				
				for (var j=0; j < item.types.length; j++) {
					var addrType = item.types[j];
					
					if (addrType.toLowerCase() == typeName.toLowerCase()) {
						found = true;						
						break;
					}
				} // types
				
				if (found) {
					value = (getShortVersion 
						? item.short_name
						: item.long_name
					);
					break;
				}
				
			}
			
			return value;
		};
		
		
		
		/// <summary>
		///
		/// </summary>
		this.renderAddressHtml = function(placeDetails) {
			var address = "";
			var ac = placeDetails.address_components;
			var breaker = ",<br/>";
			var street = "", town = "", area = "", postCode = "";
			
			if (ac.street_address)
				// direct object (custom place definiton)
				street = ac.street_address;
			else {
				// google api version
				street = findPart(ac, "street_address");
				if (street != "")
					// Not present, fall back to "route" instead
					street = value = findPart(ac, "route");
			}

			town = (ac.locality ? ac.locality : findPart(ac, "locality"));
			area = (ac.administrative_area_level_1 ? ac.administrative_area_level_1 : findPart(ac, "administrative_area_level_1"));
			postCode = (ac.postal_code ? ac.postal_code : findPart(ac, "postal_code"));
				
			var html = "";
			
			html += "<address>";
			if (street.length > 0)
				html += street + breaker;
			if (town.length > 0)
				html += town + breaker;
			if (area.length > 0)
				html += area + breaker;
			if (postCode.length > 0)
				html += postCode + breaker;
			html += "</address>";
			
			return html;
		};
		
		
		/// <summary>
		///
		/// </summary>
		this.renderPhotoHtml = function(details) {
			var html = "";
			
			if (details && details.photos && details.photos.length > 0) {
				var imgUrl = details.photos[0].getUrl({"maxWidth":"70"});
				var gPlus = "";
				
				if (details.url && details.url > 0)
					gPlus = details.url;

				// if we have a g+ link, change the photo to link to that
				if (gPlus.length > 0)
					html += "<a href='" + gPlus + "'>";
				html += "<img src=" + imgUrl + " />";
				if (gPlus.length > 0)
					html += "</a>";
			}
			
			return html;
		};

		return this;
	}; // tooltips

})(jQuery);

