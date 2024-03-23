/*jslint passfail: true, nomen: true, vars: true, white: true, indent: 2, maxerr: 999 */

/*
 * Developed by : www.toepoke.co.uk
 *
 * If you redistribute this file, please keep this section in place
 *
 * License: Same as jQuery - see http://jquery.org/license
 *
 * Compressed with:
 *   - http://closure-compiler.appspot.com/
 *
 * History:
 *  v2.1 - https://github.com/toepoke/mapsed/releases/tag/2.1.0
 *  v2.0 - https://github.com/toepoke/mapsed/releases/tag/2.0.0
 *  v1.2 - https://github.com/toepoke/mapsed/releases/tag/1.2.0
 *  v1.1 - https://github.com/toepoke/mapsed/releases/tag/1.1.0
 *  v1.0 - https://github.com/toepoke/mapsed/releases/tag/1.0.0
 * 
*/

(function () {
	// http://www.yuiblog.com/blog/2010/12/14/strict-mode-is-coming-to-town/
	"use strict";

	// singleton here (same variable across all instances of the plug-in)
	var _version = '(2.1.0)',
		_plugInName = "mapsed",
		_plugInInstances = 1
	;

	$.fn.mapsed = function (options) {

		var defaults = {
			// - Centre of the UK (ish ...)
			DEFAULT_CENTER: new google.maps.LatLng(53.175148, -1.423908),
			DEFAULT_ZOOM: 10,
			// For positioning options, see https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
			MAPSED_CONTROLBAR_POSITION: google.maps.ControlPosition.LEFT_CENTER,
			MAPSED_SEARCH_CONTROLBAR_POSITION: google.maps.ControlPosition.LEFT_TOP
		};

		// private plug-in variables
		var _plugIn = this,           // Reference back to the "mapsed" plug-in instance
			_searchBox = null,          // Search box that appears on the map 
			_gmSearchBox = null,        // Google (autocompleting) Search box the underlying input text box is twinned with 
			_searchBtn = null,          // Button to click to confirm search should be applied (not strictly needed (ENTER does the same), but users may be confused if there isn't one!)
			_moreBtn = null,            // Available when more results are available for a result set (Google Places API pages the results)
			_pageNum = 0,               // Keeps track of how many pages of results are shown (used to reset the markers on a new search)
			_gMap = null,               // Underlying Google maps object for the div
			_mapContainer = null,       // jQuery reference to the DIV the map is in
			_placesApi = null,          // Reference to the Google Places API object
			_markers = [],              // Set of markers displayed on the map
			_pagedMarkers = [],         // Set of markers that are _near_ the one the user clicked on (see pagination)
			_currMarkerPage = null,     // Currently selected index of _pagedMarkers
			_compass = null,            // Current NSEW boundary shown in the map
			_instance = -1,             // Instance "this" plug-in is managing (so we can support zmultiple maps on the page)
			_fullWin = false,           // Flags "mapsed" is in full-window mode, which means "mapsed" created the DIV we're in
			_firstSearch = true,        // Used to ensure we don't clear markers when the map is drawn for the first time (so any "showOnLoad" markers aren't cleared)
			_hasMapInitFired = false,   // Used to flag initialisation of the map (after Google Maps API has finished drawing it)
			_helpBtn = null,            // Reference to the help dialog button ([?])
			_helpDlg = null,            // Reference to the help dialog that is toggled by the help button
			_closeBtn = null,           // Reference to the close button (only used in full-window mode)
			_addBtn = null,             // Reference to the add button ([+])
			_geoBtn = null,             // Reference to the Geo location button [(*)]
			_toolbarContainer = null,   // Container for mapsed tools (add, geo, help, etc)
			_searchBarContainer = null, // Container for search control, button & more
			gm = null,                  // Short cut reference to the Google Maps namespace (this is initialised in the constructor to give the Google API time to load on the page)
			gp = null,                  // Short cut reference to the Google Places namespace (this is initialised in the constructor to give the Google API time to load on the page)
			_selectedMarker = null
		;

		/**
		 * Plug-in options:
		 * Set of options to configure how the map will behave
		 */
		var settings = $.extend(true, {
			// Array of places to show on the map initially
			// (see accompanying examples for illustration)
			showOnLoad: null,

			// Specifies the buttons and tooltips added to the map toolbar
			ToolbarButtons: {
				Go: "Go",
				More: "More|There are more results available ...",
				AddPlace: "+|Add a place",
				CloseMap: "&times;|Close map",
				Geo: "&otimes;|Centre map based on your location",
				Help: "?|Show help"
			},

			// Species the text of the buttons used the dialog templates
			ActionButtons: {
				Select: "Select",
				Edit: "Edit",
				Delete: "Delete",
				Save: "Save"
			},

			// Options for drawing the map.  This is the same object
			// that is passed to the Google Maps API when creating the map.
			// If you need something custom supported by the Google Maps API
			// you should be able to add in your own initialisation code 
			// to this object.
			mapOptions: {
				// Initial zoom level (initially not set)
				// ... be cautious when setting a zoom level _and_ defining custom places as you may set the
				// ... level to such a level that your places aren't visible
				// ... by default the map will expand to show all custom places, you can change this with the "forceCenter" option
				zoom: defaults.DEFAULT_ZOOM,

				// Default to the best theatre ever :-)
				center: defaults.DEFAULT_CENTER,

				// Type of map to show initially
				mapTypeId: google.maps.MapTypeId.ROADMAP,

				// Mapsed has facilities for handling full-screen mode
				// ... turn off Google's so we have better control of the UI
				fullscreenControl: false,

				// Override default positioning so mapsed controls can enjoy better placement
				mapTypeControl: true,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
					position: google.maps.ControlPosition.LEFT_BOTTOM
				}
			},

			// Flags whether Google Maps should still display other points-of-interest
			// By default POI is enabled because the POIs can't be turned off when using custom styled maps
			// (well without significant hacks!)
			// If you require custom maps, you need "disablePoi" set to false
			disablePoi: false,

			searchOptions: {
				// Flags that the user can search for places themselves
				// ... adds a search box to the map
				enabled: false,

				// Placeholder text for the search box
				placeholder: "e.g. Hotels in Leeds",

				// Initialises the place search with a given text search
				// ... (i.e. once the map has been created, the results for this string are also shown)
				initSearch: "Hotels in Leeds",

				// Performs a search when geo-location is activated.  This can be either 
				// on load (see "findGeoOnLoad" option) or when the Geo location button is clicked
				// {POSITION} is replaced with the detected Geo location position
				// "geoSearch" supersedes any "initSearch" specified (if the user enables Geo location for the map)
				geoSearch: "5aside football near {POSITION}"
			},

			// Event fired when user clicks the "Add" button (+)
			// Useful if you want to perform some initialisation on the marker/place details
			// prototype: function(mapsed, marker)
			onAdd: null,

			// Event fired when user clicks "Save" button on a "new" place.
			// The presence of this event adds the the "+" button to the toolbar.
			// In many cases you can just re-use your "onSave" event handler.
			// Seealso "onSave" which has the same prototype
			// prototype: function(mapsed, newPlace)
			//   return a error message string if you're not happy with what's been entered
			//   return an empty string to confirm it's been saved
			onAddSave: null,

			// Event when user clicks the "Select" button
			// prototype: function(mapsed, details)
			onSelect: null,

			// Allows custom places to be edited and then saved
			// Seealso "onAddSave" which has the same prototype
			// prototype: function(mapsed, newPlace)
			//   return a error message string if you're not happy with what's been entered
			//   return an empty string to confirm it's been saved
			onSave: null,

			// Allows the user to delete a "custom" map they've previously added
			// prototype: function(mapsed, details)
			//  return true to confirm delete, false abandons the delete
			onDelete: null,

			// Flags that the user is asked for confirmation if they try and
			// delete a place
			confirmDelete: false,

			// Event fires when user clicks the "X" button (only in full window mode)
			// prototype: function(mapsed)
			// 	return true to close the map, false keeps it open
			onClose: null,

			// [async] Event fired when the "boundary" in the Google map changes, due to:
			//   - User completes a new search, or
			//   - User drags the map to a new location
			//   - User zooms in or out
			//   - Probably a 101 different reasons ...
			// Params: (tlLat, tlLng, brLat, brLng) - the rectangle coordinates visible in the map bounds (ie. the container DIV)
			onMapMoved: null,

			// Callback for getting the [image] URL to use for a marker
			// Parameter "markerType" is passed, indicating the type of marker, this can be
			// prototype: function(mapsed, markerType, title)
			// Parameters:
			//   mapsed: Reference to the mapsed plugin
			//   markerType: The type of marker being added to the map:
			//      "new" = Marker created using the "+" button to add a new place
			//      "google" = Marker is being added from a Google Places place
			//      "custom" = Marker is being added from application database (via "showOnLoad" array)
			//   title: Title attribute of the marker
			// Returns:
			//   Google Icon object (see https://developers.google.com/maps/documentation/javascript/reference#Icon)
			getMarkerImage: null,

			// Adds a help button to give further instructions to the end user
			// prototype: function()
			getHelpWindow: null,

			// show the help dialog when the map is loaded
			showHelpOnLoad: false,

			// Adds a GEO location button onto the map which is used to set the 
			// centre of the map according to the user's GEO location position
			allowGeo: false,

			// Flags that mapsed should place the centre of the map where the user's
			// GEO location position is.
			// Note: This is ignored if "showOnLoad" property is populated as there is 
			//       a risk the places won't be shown on the map
			findGeoOnLoad: false,

			// When adding custom places, mapsed will expand the map to show all places
			// Usually this is what you'd want, but sometimes you may want to focus on a particular area
			// "forceCenter" will override the default behaviour and centre where specified in the options
			forceCenter: false,

			// Helper to aid debugging mapsed itself (you must include mapsed.dev.js to use this)
			// ... (mainly to aid mapsed development)
			debugger: null

		}, options || {});


		//
		// PUBLIC METHODS
		//

		/**
		 * Get the settings the map was build with
		 * @returns settings
		 */
		this.getSettings = function () {
			return settings;
		};


		/**
		 * Gets the underlying Google Map object that was initially
		 * created
		 * - useful if you want to play directly with the map to provide
		 *   further functionality outside mapsed
		 * @returns Google map object
		 */
		this.getGoogleMap = function () {
			return _gMap;
		};


		/**
		 * Usually you'll already know this (it's how you called up 
		 * the mapsed jQuery plugin - however in full-window mode the div is
		 * generated, so you'll need this then ... sometimes :-) 
		 * - see "onPreInit" full-window example.
		 * @returns caller DIV where the Google map is contained within
		 */
		this.getMapContainer = function () {
			return _mapContainer;
		};


		/**
		 * Helper method to make it a bit easier to add your own container onto the map.
		 * This can contain multiple "controls" (HTML elements).
		 * Remarks:
		 * Turns out adding a generic DIV to the map is the "right" way to do it, see:
		 * https://developers.google.com/maps/documentation/javascript/controls#CustomControls
		 * @param {any} markUp HTML for the control (just HTML, no jQuery or anything, ID is _not_ required) - typically just a generic DIV
		 * @param {any} ctrlPos Where on the map the control should be added, available options details here - https://developers.google.com/maps/documentation/javascript/controls#ControlPositioning
		 * @returns HTML element of the control added (to allow the caller to easily wire up events)
		 */
		this.addMapContainer = function (markUp, ctrlPos) {
			var $container = null,
				$html = null
			;

			// create a jQuery object out of the markup
			$html = $(markUp);

			// add control into the DOM 
			// ... (as part of the map container as the control is "owned" by the map)
			$container = $html.appendTo(_mapContainer);

			// tell Google Maps where to place it
			_gMap.controls[ctrlPos].push($container[0]);

			// and return the create control so the events can be wired up
			// ... (note we return the HTML element, not the jQuery object)
			return $container[0];
		};


		/**
		 * Turns off clicking of Google places of interest.
		 * Note this turns off ALL styling so don't use this option
		 * when using custom styles.
		 */
		this.disablePointsOfInterest = function () {
			_gMap.styles =
				[
					{
						featureType: "poi",
						stylers: [
							{ visibility: "off" }
						]
					}
				];

		},


		/**
		 * When in full-window mode, this will close the map
		 * and release resources.
		 */
		this.closeMap = function () {
			// just kill the DIV container and Google object
			_gMap = null;

			// close help dialog (if displayed)
			if (_helpDlg) {
				_helpDlg.fadeOut();
			}

			// close if only available if we created the DIV and we're in full screen mode
			// so kill off the DIV and remove
			_mapContainer.fadeOut(function () {
				$(this).remove();
			});

			// no longer in full window mode
			_fullWin = false;

		} // closeMap


		/**
		 * Displays a modal message over the top of the map
		 * @param {any} title text to appear in the title bar
		 * @param {any} msg text to appear as the main message
		 * @param {any} callback callback function to call when OK is clicked
		 */
		this.showMsg = function (title, msg, callback) {
			buildMsg(title, msg, false/*doConfirm*/, "", callback);
		}

		/**
		 * Displays the "Add" dialog once the calling application
		 * has resolved what should be displayed for the new marker
		 * @param {any} marker - marker to show (i.e. the one we've just added)
		 */
		this.showAddDialog = function (marker) {
			// new places can always be edited
			marker.showTooltip(true/*inRwMode*/);
		}


		/**
		 * Displays a modal confirmation over the top of the map, prompting
		 * the user to "confirm" _some_ action
		 * @param {any} title text to appear in the title bar
		 * @param {any} msg text to appear as the main message
		 * @param {any} prompt text to appear next to the action buttons
		 * @param {any} callback callback function to call when OK is clicked
		 *                       Note the callback is ONLY called when OK is clicked
		 */
		this.confirmMsg = function (title, msg, prompt, callback) {
			buildMsg(title, msg, true/*doConfirm*/, prompt, callback);
		}


		/**
		 * Moves the map location to the centre of the geo-location of the user
		 * If custom places are defined, these are also added.
		 * Note: Custom places are only added when the map is first loaded
		 * If the user clicks the geo-button the custom places aren't added as the "geoSearch"
		 * takes priority, overwriting the "showOnLoad" places (due to order of the callbacks)
		 * @returns none
		 */
		this.setMapCentreByGeo = function () {
			if (!navigator.geolocation)
				// GEO location not supported
				return;

			navigator.geolocation.getCurrentPosition(
				function (geoPos) {
					var pos = new gm.LatLng(geoPos.coords.latitude, geoPos.coords.longitude);
					_gMap.setZoom(10);
					_gMap.setCenter(pos);

					// change geo button to show it's now active
					_geoBtn.classList.add("is-active");

					// first time map has been loaded, so apply any initial search
					var so = settings.searchOptions;
					if (so && so.geoSearch && so.geoSearch.length > 0) {
						var newLocation = pos.toUrlValue();
						var search = so.geoSearch.replace("{POSITION}", newLocation);

						clearMarkers();
						doSearch(search);
					}

					if (so && settings.showOnLoad) {
						addInitialPlaces();
					}
				},
				function (err) {
					_plugIn.showMsg("GEO Position", err.message);
				}
			);
		}


		/**
		 * Helper to create a button element (used for toolbar buttons, search, etc)
		 * @param {any} text - Text of the button, can have tooltip embedded, e.g. "Go|This is the go button"
		 * @param {any} classNames - CSV of classes to add
		 * @param {any} onClickHandler - Button "Click" handler
		 * @param {any} type - Element type, defaults to "BUTTON"
		 * @returns Created element.
		 */
		function createButton(text, classNames, onClickHandler, type = "BUTTON") {
			var buttonText = text,
			    tooltip = ""
			;
			var btn = document.createElement(type);

			// We allow the use the pipe symbol to associate a tooltip
			if (text && text.indexOf("|") > 0) {
				var splitter = text.split('|');
				buttonText = splitter[0];
				tooltip = splitter[1];
			}
			btn.innerHTML = buttonText;

			if (tooltip && tooltip.length > 0) {
				btn.setAttribute("title", tooltip);
			}

			if (onClickHandler && typeof onClickHandler === "function") {
				btn.addEventListener("click", onClickHandler);
			}

			if (classNames) {
				if (classNames.indexOf(",") > 0) {
					// multiple classes to add (can't have any delimiting spaces though)
					classNames = classNames.replaceAll(" ", "");
					var classes = classNames.split(",");
					btn.classList.add(...classes);
				} else {
					btn.className = classNames;
				}
			}

			return btn;
		}


		//
		// MAPSED EVENT HANDLERS
		// - Handlers for mapsed events.  Typically these will issue
		// callbacks to the calling application (see events in the settings above)
		//

		/**
		 * Internal event handler when the "Select" button is clicked
		 * - Builds the model and forwards onto the callback for confirmation
		 * @param {any} element Element of the place being selected
		 */
		function onPlaceSelect(element) {
			var $root = element.parents(".mapsed-root");
			var $vw = element.parents(".mapsed-view");
			var model = getViewModel($vw);

			if (settings.onSelect(_plugIn, model)) {
				closeTooltips();
			}

		} // onPlaceSelect


		/**
		 * Internal event handler when the "Edit" button is clicked
		 * - Swaps the tooltip to edit mode, prompting for data entry
		 * @param {any} element 
		 */
		function onPlaceEdit(element) {
			var $root = element.parents(".mapsed-root");
			var lat = $root.find(".mapsed-lat").val();
			var lng = $root.find(".mapsed-lng").val();

			// find the appropriate marker
			var marker = findMarker(lat, lng);

			// close any open tooltips so the user can concentrate on editing
			closeTooltips();

			// user clicks the edit button, so swap to edit mode
			marker.showTooltip(true/*inRwMode*/);

		} // onPlaceEdit


		/**
		 * Event handler for when a marker is added to the map, either
		 * as a new marker, or when an existing marker is added to the map.
		 * Shows the infoWindow for the location.
		 * @param {any} evt
		 */
		function onMarkerClicked(evt) {
			var canEdit = false;
			var canDelete = false;
			var currMarker = this;
			closeTooltips();

			if (_selectedMarker == currMarker) {
				// Already selecting the marker, so treat as a toggle and turn
				// it off again (closeTooltips above has already closed it)
				_selectedMarker = null;
				return;
			}

			_pagedMarkers = findNearbyMarkers(currMarker);
			settings?.debugger?.logger("_pagedMarkers", _pagedMarkers, "_currMarkerPage", _currMarkerPage);

			if (currMarker.details.markerType == "new") {
				canEdit = true;
				canDelete = true; // whilst it's just been created there's no reason they can't delete it again straight away ... may have changed their mind
				if (settings.onAdd) {
					settings.onAdd(_plugIn, currMarker);
				}
			} else {
				// Initially we show the view template.  User can then decide
				// whether to SELECT, EDIT or DELETE the marker
				canEdit = false;
				canDelete = false;
			}

			currMarker.showTooltip(canEdit);
		}


		/**
		 * Event fired when the user clicks the "Next" button (>)
		 * on a paginated result.
		 * @param {any} evt - Next button click event
		 */
		function onNextMarker(evt) {
			var currMarker = _pagedMarkers[_currMarkerPage];
			currMarker.tooltip.close();

			_currMarkerPage++;
			currMarker = _pagedMarkers[_currMarkerPage];
			currMarker.showTooltip(false/*view*/);
		}


		/**
		 * Event fired when the user clicks the "Previous" button (<)
		 * on a paginated result.
		 * @param {any} evt - Previous button click event
		 */
		function onPrevMarker(evt) {
			var currMarker = _pagedMarkers[_currMarkerPage];
			currMarker.tooltip.close();

			_currMarkerPage--;
			currMarker = _pagedMarkers[_currMarkerPage];
			currMarker.showTooltip(false/*view*/);
		}


		/**
		 * Internal event handler when the "Add" button is clicked
		 * @param {any} evt
		 */
		function onPlaceAdd(evt) {
			evt.preventDefault();

			var centre = _gMap.getCenter();
			var bounds = new gm.LatLngBounds();
			var newMarker = createMarker("New place", centre, true/*draggable*/, "new");
			attachTooltip(newMarker);

			_markers.push(newMarker);
			bounds.extend(centre);

			gm.event.addListener(newMarker, "click", onMarkerClicked);

			gm.event.addListener(newMarker, "dragend", function (evt) {
				var currMarker = this;
				// only time when lat/lng can change!
				currMarker.details.lat = evt.latLng.lat();
				currMarker.details.lng = evt.latLng.lng();
				var tip = $(currMarker.tooltip.content);
				tip.find(".mapsed-lat").val(currMarker.details.lat);
				tip.find(".mapsed-lng").val(currMarker.details.lng);
			});

			// for tooltip to be displayed
			gm.event.trigger(newMarker, "click");

		} // onPlaceAdd


		/**
		 * Internal event handler when the "Delete" button is clicked
		 * - Builds the model and forwards onto the callback for confirmation.
		 * @param {any} element
		 */
		function onPlaceDelete(element) {
			var $root = element.parents(".mapsed-root");
			var $vw = $root.find(".mapsed-view");
			var model = getViewModel($vw);

			if (settings.onDelete(_plugIn, model)) {
				// find the appropriate marker
				var marker = findMarker(model.lat, model.lng);

				// remove the marker
				marker.tooltip = null;
				marker.setMap(null);
			}

		} // onPlaceDelete


		/**
		 * Internal event handler when the "Save" button is clicked (in the edit dialog)
		 * - Builds the model and forwards onto the callback for confirmation and validation
		 * - Should the validation fail (callback returns error messages) the edit dialog
		 *   will remain for the user to resolve the errors
		 * @param {any} element
		 * @returns none
		 */
		function onPlaceSave(element) {
			var root = element.parents(".mapsed-root");
			var $rw = root.find(".mapsed-edit");
			var errors = "";
			var place = getViewModel($rw);
			var isNew = (place.markerType == "new");

			// Ensure the end user has the event wired up
			if (isNew) {
				if (!settings.onAddSave) throw new Error("onAddSave event has not been defined");
			} else {
				if (!settings.onSave) throw new Error("onSave event has not been defined");
			}

			// if we're saving it can no longer be "new"
			place.markerType = "custom";

			// see if the calling code is happy with what's being changed
			if (isNew) {
				errors = settings.onAddSave(_plugIn, place);
			} else {
				errors = settings.onSave(_plugIn, place);
			}

			var errCtx = $rw.find(".mapsed-error");
			if (errors && errors.length > 0) {
				// not happy, show errors returned
				errCtx.text(errors);
				return;
			}
			// no errors
			errCtx.text("");

			// find the marker, so we can update the model on the marker
			var marker = findMarker(place.lat, place.lng);

			// update the model to reflect the changes made
			jQuery.extend(marker.details, place);
			// ... markerType is held a two levels
			marker.markerType = place.markerType;

			// update the icon (place could be new and then been saved)
			if (settings.getMarkerImage) {
				var image = settings.getMarkerImage(_plugIn, marker.markerType);
				marker.setIcon(image.url);
			}

			// once an object has been edited successfully it becomes a normal editable "custom" object
			root.find(".mapsed-marker-type").val("custom");
			// also need to save back the userData (which may have changed, but is outside the view)
			root.find(".mapsed-user-data").val(place.userData);

			// editing complete, go back to the "Select" mode
			marker.showTooltip(false/*inRwMode*/);

		} // onPlaceSave


		//
		// GOOGLE EVENT HANDLERS
		// - Set of Google events consumed by the plug-in
		//

		/**
		 * Fires once the map has initially loaded.  This lets us do some initialisation
		 * for the map (e.g. change positions of buttons we've added to the map as these are
		 * set by Google Maps so we have to wait until the map is loaded before we tweak them).
		 */
		function gmMapLoaded() {

			if (_helpDlg) {
				if (settings.showHelpOnLoad && _helpBtn.click) {
					_helpBtn.click();
				}
			}

			if (settings.findGeoOnLoad) {
				_plugIn.setMapCentreByGeo();
			}

		} // gmMapLoaded


		/**
		 * When the user submits a search (see "searchOptions")
		 * we clear any existing hits otherwise it will get confusing really
		 * quickly.
		 * (plus this is the same behaviour as Google Maps itself)
		 */
		function clearMarkers() {
			if (_markers && _markers.length > 0) {
				for (var i = 0; i < _markers.length; i++) {
					var currMarker = _markers[i];
					// We want to keep the "custom" ones ... whole point of this plugin!
					if (currMarker.details.markerType != "custom") {
						currMarker.tooltip = null;
						currMarker.setMap(null);
					}
				}
			}

			_markers = [];

		} // clearMarkers


		/**
		 * Event hookup for when a place is selected by the end user from the search
		 * control (if enabled).
		 * @param {any} places Results from the Google Places API query
		 * @param {any} status Status of the query (from Google API) - mainly used to see if there were _any_ results.
		 * @param {any} pagination Flags whether there are more results to be found
		 */
		function gmPlaceSelected(places, status, pagination) {
			if (!_firstSearch) {
				// If we're pre-populated the map with markers (via "showOnLoad" setting)
				// and put some results up on start-up (via the "initSearch" option)
				// we don't want to clear the markers as we'll remove the "showOnLoad"
				// ones we've added
				if (_pageNum == 0) {
					clearMarkers();
				}
			}

			_firstSearch = false;

			if (status == "ZERO_RESULTS") {
				// nothing to see here
				_plugIn.showMsg("No results", "Your search returned no results.");
			}

			// For each place, get the icon, place name, and location.
			var bounds = new gm.LatLngBounds();
			for (var i = 0, place; place = places[i]; i++) {
				if (!place.place_id)
					continue;

				var pos = place.geometry.location;
				var marker = addMarker(place, pos, "google", bounds);

				// start off with just the minimal info we're given
				// ... later we'll try and get more details, but if we can't at least
				// ... we have _something_!
				normaliseFormattedAddress(marker.details, place.formatted_address);

				// expand the map out so the new places fit
				bounds.extend(pos);
				_gMap.fitBounds(bounds);
			} // for

			if (pagination) {
				_moreBtn.disabled = !pagination.hasNextPage;

				if (pagination.hasNextPage) {
					_moreBtn.addEventListener("click", function() {
						_pageNum++;
						pagination.nextPage();
						return false;
					}, {
						once: true
					});
				}
			}

		} // gmPlaceSelected


		/**
		 * Helper method to perform a search to the Google Places API, translate
		 * the results into something more useful for us and fire a callback once complete
		 * @param {any} forMarker Marker to show details of
		 * @param {any} callback Callback to execute once details have been processed
		 * @returns noe
		 */
		function getPlaceDetails(forMarker, callback) {
			if (!forMarker.details)
				return;
			if (!forMarker.details.place_id)
				return;

			var request = {
				placeId: forMarker.details.place_id
			};
			_placesApi.getDetails(request,
				function (placeDetails, status) {
					// Either way we're loaded. 
					// If we fail, we revert to using the basic data (otherwise we'll just keep trying!)
					forMarker.details.isLoaded = true;

					if (status != gp.PlacesServiceStatus.OK) {
						return;
					}

					normalisePlacesApiAddress(forMarker.details, placeDetails);

					callback(forMarker);
				}
			);

		} // getPlaceDetails


		/**
		 * Map boundary change event (moving map, zooming in or out, etc).
		 * 
		 * Required so we can tell the search box (if enabled) that the
		 * boundary of the map (and therefore the boundary the search should
		 * be applied to) has changed.
		 */
		function gmBoundsChanged() {
			var bounds = _gMap.getBounds();
			if (bounds) {
				_gmSearchBox.setBounds(bounds);
			}

		} // gmBoundsChanged


		/**
		 * Map "Idle" event - fires when the user has stopped interacting (dragging, zooming, etc)
		 * in the map.  This then fires the "onMapMoved" callback to the caller allowing them to search
		 * for places in their back-end which fall onto the map at the current boundary and zoom level.
		 */
		async function gmIdle() {
			settings?.debugger?.clearPolygon();
			var bounds = _gMap.getBounds();
			if (!bounds) {
				return;
			}

			_compass = bounds.toJSON();

			if (settings.onMapMoved) {
				var hits = await settings.onMapMoved(_compass.north, _compass.south, _compass.east, _compass.west);
				if (hits && hits.length > 0) {
					for (var i = 0; i < hits.length; i++) {
						var place = hits[i];
						if (!place.lat || !place.lng) {
							continue;
						}
						var pos = new gm.LatLng(place.lat, place.lng);
						if (!findMarker(place.lat, place.lng)) {
							addMarker(place, pos, "custom", bounds);
						}
					}

				}
			}

		} // gmIdle


		//
		//
		// PRIVATE METHODS
		//
		//

		/**
		 * Helper for building up a modal message on the screen.
		 * @param {any} title text for the title bar
		 * @param {any} msg message text to appear
		 * @param {any} doConfirm internal flag tell us whether we're building an "alert" or a "confirm"
		 * @param {any} prompt text to appear next to the action buttons
		 * @param {any} callback callback for when Yes/OK is clicked
		 *                       Note the callback is _NOT_ called if "cancel" is pressed.
		 */
		function buildMsg(title, msg, doConfirm, prompt, callback) {
			var $modal = null,
				html = "",
				buttons = ""
				;

			// protect from undefined
			title = title || "";
			msg = msg || "";

			$modal = _mapContainer.find(".mapsed-modal");

			if ($modal.length > 0) {
				// usually we'd just re-use it, but we need to change basically 
				// everything (include the callback)
				$modal.remove();
			}

			buttons += "<div class='mapsed-modal-button-bar'>";
			if (prompt && prompt.length > 0) {
				buttons += `<p class='prompt'>${prompt}</p>`;
			}
			buttons += "<div class='mapsed-modal-buttons'>";
			if (doConfirm) {
				buttons += "<button class='ok'>OK</button>";
				buttons += "<button class='cancel'>Cancel</button>";
			} else {
				buttons += "<button class='close'>OK</button>";
			}
			buttons += "</div>";
			buttons += "</div>";

			html = 
`<div class='mapsed-modal'>
	<h3>${title}</h3>
	<div>
		<div class='mapsed-modal-message'>
		${msg}
		</div>
		${buttons}
	</div>
</div>`;

			$modal = $(html).appendTo(_mapContainer);
			$modal
				.find("button")
				.on("click", function () {
					var $btn = $(this);
					$modal.fadeOut();
					if (!$btn.hasClass("cancel")) {
						// only call the callback if we haven't cancelled
						if (callback)
							callback($btn);
					}
				})
				.end()
				.fadeIn()
				;

		} // buildMsg


		/**
		 * Convenience function to add a new marker onto a map
		 * and wire up the events (click, etc).
		 * @param {any} model Data model for the marker (i.e. it's address details)
		 * @param {any} position Position of the marker (lat/lng)
		 * @param {any} markerType Type of marker ("add", "custom", "google", etc)
		 * @param {any} bounds Lat/Lng boundary of the marker
		 * @returns Created marked
		 */
		function addMarker(model, position, markerType, bounds) {
			var marker = createMarker(
				model.name,
				position,
				false/*draggable*/,
				markerType
			);

			jQuery.extend(marker.details, model);
			attachTooltip(marker);
			_markers.push(marker);
			bounds.extend(position);

			// wire up click event
			gm.event.addListener(marker, "click", onMarkerClicked);

			if (model.autoShow) {
				// show on load enabled for marker
				marker.showTooltip(false/*inRwMode*/);
			}

			return marker;

		} // addMarker


		/**
		 * Convenience function to shorten a string to a
		 * maximum length, adding an ellipsis (...) if required.
		 * @param {any} value String to shorten
		 * @param {any} maxLen Longest allowed length of the string
		 * @returns value shortened to maxLen (or full if < maxLen)
		 */
		function shorten(value, maxLen) {
			var shortValue = value;

			if (!maxLen) {
				maxLen = 30;
			}

			if (value.length > maxLen) {
				shortValue = value.substring(0, maxLen - 3) + "...";
			}

			return shortValue;

		} // shorten


		/**
		 * Quick and dirty replace method for applying templates
		 * @param {any} find Text to find
		 * @param {any} replace Text to replace with
		 * @param {any} str Source text to apply find/replace against
		 * @returns "str" with replacements applied
		 */
		var replaceAll = function (find, replace, str) {
			if (replace == undefined)
				replace = "";
			return str.replace(new RegExp(find, 'g'), replace);

		} // replaceAll


		/**
		 * Quick and dirty template function, just does a replacement
		 * according to our model ... nothing more advanced than that!
		 * @param {any} tmpl Template string to apply template to
		 * @param {any} model Data to be applied (i.e. address details of the "place")
		 * @param {any} renderOptions Options to take into account (typically custom headers & footers)
		 * @param {any} $ctx Element to apply template too (i.e. View or Edit element)
		 */
		function applyTemplate(tmpl, model, renderOptions, $ctx) {
			var header = "", footer = "";
			tmpl = replaceAll("{NAME}", model.name, tmpl);
			tmpl = replaceAll("{SHORT_NAME}", shorten(model.name, 25), tmpl);
			tmpl = replaceAll("{STREET}", model.street, tmpl);
			tmpl = replaceAll("{TOWN}", model.town, tmpl);
			tmpl = replaceAll("{AREA}", model.area, tmpl);
			tmpl = replaceAll("{POSTCODE}", model.postCode, tmpl);
			tmpl = replaceAll("{COUNTRY}", model.country, tmpl);
			tmpl = replaceAll("{TELNO}", model.telNo, tmpl);
			tmpl = replaceAll("{WEBSITE}", model.website, tmpl);
			tmpl = replaceAll("{MORE}", model.url, tmpl);
			if (model.photo) {
				var path = model.photo.getUrl({ "maxWidth": "70" });
				tmpl = replaceAll("{PHOTOURL}", path, tmpl);
				// used to delay when jQuery tries to render the image tag
				tmpl = replaceAll("{IMG", "<img", tmpl);
			}
			if (model.addInfo) {
				tmpl = replaceAll("{ADD_INFO}", model.addInfo, tmpl);
			}
			if (renderOptions?.header) header = renderOptions.header;
			if (renderOptions?.footer) footer = renderOptions.footer;
			tmpl = replaceAll("{HEADER}", header, tmpl);
			tmpl = replaceAll("{FOOTER}", footer, tmpl);

			$ctx.html(tmpl);

			// The edit template is a table so if there's no content we need to hide the row
			// ... we don't know which template we're dealing with so just apply to both
			$ctx.find(".mapsed-view-header").toggle( header !== '' );
			$ctx.find(".mapsed-view-footer").toggle( footer !== '' );

			var pagingButtons = $ctx.find(".mapsed-paging-buttons");

			// Paging buttons may not necessarily be present
			// ... (e.g.if we've created a new marker, we don't have paging enabled)
			if (pagingButtons.length > 0) {
				var hasNearbyMakers = hasNearbyMarkers();
				pagingButtons.toggle(hasNearbyMakers);

				if (hasNearbyMakers) {
					var $prev = $ctx.find(".mapsed-prev-marker");
					var $next = $ctx.find(".mapsed-next-marker");

					$prev.click(onPrevMarker);
					$next.click(onNextMarker);
					if (_currMarkerPage == 0) {
						$prev[0].disabled = true;
					}
					if (_currMarkerPage == _pagedMarkers.length - 1) {
						$next[0].disabled = true;
					}
				}
			}

		} // applyTemplate


		/**
		 * Ensures when the view is shown any entities with nothing in them aren't
		 * shown (and any that are shown, are shown correctly)
		 * @param {any} model Data model to examine (e.g. if there's no data in the address we want to hide that part of the diaog)
		 * @param {any} $vw Element to apply the hiding of data to (this _will_ be the ReadOnly template)
		 */
		function hideEmpty(model, $vw) {
			// and hide bits that aren't relevant (or empty)
			$vw.find(".mapsed-name").parent().toggle(model.name && model.name.length > 0);
			$vw.find(".mapsed-street").toggle(model.street && model.street.length > 0);
			$vw.find(".mapsed-town").toggle(model.town && model.town.length > 0);
			$vw.find(".mapsed-area").toggle(model.area && model.area.length > 0);
			$vw.find(".mapsed-postCode").toggle(model.postCode && model.postCode.length > 0);
			$vw.find(".mapsed-country").toggle(model.country && model.country.length > 0);

			// these are a little different as we want them block if they're available (they're a tags)
			var $telNo = $vw.find(".mapsed-telNo"),
				$ws = $vw.find(".mapsed-website"),
				$url = $vw.find(".mapsed-url")
				;
			if (model.telNo && model.telNo.length > 0) {
				$telNo.show().css("display", "block");
			} else {
				$telNo.hide();
			}
			if (model.website && model.website.length > 0) {
				$ws.show().css("display", "block");
			} else {
				$ws.hide();
			}
			if (model.url && model.url.length > 0) {
				$url.show().css("display", "block");
			} else {
				$url.hide();
			}

			$vw.find(".mapsed-photo").toggle(model.photo != null);
			$vw.find(".mapsed-add-info").toggle(model.addInfo != null);

			var settings = _plugIn.getSettings();

			if (settings.onSelect || settings.onSave || settings.onDelete) {
				var showSelect, showSave, showDelete, canEdit, canDelete;

				canEdit = model.canEdit;
				canDelete = model.canDelete;
				// however if it's a google marker we can't, so ignore what the input says!
				if (model.markerType == "google") {
					canEdit = false;
					canDelete = false;
				}

				showSelect = settings.onSelect != null;
				showSave = (
					settings.onSave != null && canEdit
					// can only delete markers we created!
					&& model.markerType == "custom"
				);
				showDelete = (
					settings.onDelete != null && canDelete
					// can only delete markers we created!
					&& model.markerType == "custom"
				);

				$vw.find(".mapsed-select-button").toggle(showSelect);
				$vw.find(".mapsed-edit-button").toggle(showSave);
				$vw.find(".mapsed-delete-button").toggle(showDelete);
			} else {
				// neither should be shown, so hide the button container to hide the whole row
				$vw.find(".mapsed-buttons").hide();
			}

		} // hideEmpty


		/**
		 * Finds a marker in the loaded set based on the provided lat/lng given co-ordinates
		 * - the model doesn't have a "place_id" to the markers, hence the need to find them
		 * @param {any} lat Latitude position to search against
		 * @param {any} lng Longitude position to search against
		 * @returns Marker if found, null otherwise
		 */
		function findMarker(lat, lng) {
			var marker = null;

			for (var i = 0; i < _markers.length; i++) {
				var m = _markers[i];
				if (m.position.lat() == lat && m.position.lng() == lng) {
					marker = m;
					break;
				}
			}

			return marker;

		} // findMarker


		/**
		 * When zoomed out and the user clicks on a marker there
		 * can be lots of markers in a similar area, often overlapping
		 * each other.  
		 * 
		 * This method finds all markers that are _near_ to the one that 
		 * was clicked so we can page through similar markers without 
		 * having to zoom-in or delicately click the right one.
		 * @param {any} selectedMarker - Marker on map user has clicked
		 * @returns The set of nearby markers found (also stored in _pagedMarkers)
		 */
		function findNearbyMarkers(selectedMarker) {
			var ns = (_compass.north - _compass.south);
			var ew = (_compass.west - _compass.east);
			var nsPc = Math.abs(ns / 75);
			var ewPc = Math.abs(ew / 50);
			var lat = selectedMarker.position.lat(),
				lng = selectedMarker.position.lng()
				;
			var currMarkerBounds = {
				n: lat - nsPc,
				s: lat + nsPc,
				w: lng - ewPc,
				e: lng + ewPc
			};

			settings?.debugger?.drawNearbyPolygon(_gMap, currMarkerBounds);

			// Reset
			_pagedMarkers = [];
			_currMarkerPage = null;
			for (var i = 0; i < _markers.length; i++) {
				var m = _markers[i];
				var mLat = m.position.lat();
				var mLng = m.position.lng();

				var isLatNearby = false, isLngNearby = false;
				if (mLat > currMarkerBounds.n && mLat < currMarkerBounds.s) {
					settings?.debugger?.logger("mLat", mLat, "n", currMarkerBounds.n, "s", currMarkerBounds.s);
					settings?.debugger?.logger("mLng", mLng, "w", currMarkerBounds.w, "e", currMarkerBounds.e);
					isLatNearby = true;
				}
				if (mLng > currMarkerBounds.w && mLng < currMarkerBounds.e) {
					isLngNearby = true;
				}

				if (isLatNearby || isLngNearby) {
					settings?.debugger?.logger(m.details.name, "m",
						{
							mLat: mLat,
							mLng: mLng,
							isLatNearby: isLatNearby,
							isLngNearby: isLngNearby
						},
						currMarkerBounds
					);
				}

				if (isLatNearby && isLngNearby) {
					_pagedMarkers.push(m);
					if (selectedMarker == m) {
						_currMarkerPage = _pagedMarkers.length - 1;
					}
				}
			}

			settings?.debugger?.clearLog();
			for (var i = 0; i < _pagedMarkers.length; i++) {
				settings?.debugger?.logger(i, _pagedMarkers[i].details.name);

				const cityCircle = new google.maps.Circle({
					strokeColor: "#000000",
					strokeOpacity: 0.8,
					strokeWeight: 2,
					fillColor: "#000000",
					fillOpacity: 0.35,
					_gMap,
					center: {
						lat: _pagedMarkers[i].position.lat() + 0.001,
						lng: _pagedMarkers[i].position.lng() + 0.001
					},
					radius: 100000,
				});
			}

			return _pagedMarkers;

		} // findNearbyMarkers


		/**
		 * 
		 * @returns
		 */
		function hasNearbyMarkers() {
			if (!_pagedMarkers) {
				return false;
			}

			// > 1 as we always add the marker the user has selected
			return (_pagedMarkers.length > 1);
		}


		/**
		 * Adds a search box to the top left of the map which the user can use
		 * to search for places of interest.
		 * @see https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
		 * @returns none
		 */
		function addSearch() {
			var id = `mapsed-search-box-${_instance}`;

			if (_searchBox) {
				// already added
				return;
			}

			// create the "search" box and add to document (in body)
			var so = settings.searchOptions;

			_searchBox = document.createElement("INPUT");
			_searchBox.type = "SEARCH";
			_searchBox.classList.add("mapsed-searchbox");
			_searchBox.setAttribute("autocomplete", "off");
			if (so.enabled && so.placeholder) {
				_searchBox.placeholder = so.placeholder;
			} else {
				_searchBox.placeholder = "Search ...";
			}
			if (so.enabled && so.initSearch && so.initSearch.length > 0) {
				_searchBox.value = so.initSearch;
			}
			_searchBarContainer.appendChild(_searchBox);

			// associate with places api
			// ... note Google Maps API doesn't play well with jQuery
			_gmSearchBox = new gp.SearchBox(_searchBox);

			// and wire up the callback when a user selects a hit
			gm.event.addListener(_gmSearchBox, "places_changed",
				function () {
					var searchFor = _searchBox.value;
					clearMarkers();
					doSearch(searchFor);
				}
			);
			// and again for when they zoom in/out
			gm.event.addListener(_gMap, "bounds_changed", gmBoundsChanged);

			// add search button
			_searchBtn = createButton("Go", "mapsed-search-button, mapsed-control-button", function (evt) {
				evt.preventDefault();
				var searchFor = _searchBox.value;
				clearMarkers();
				doSearch(searchFor);
			});
			_searchBarContainer.appendChild(_searchBtn);

			// For handling additional results, note there is no event handlers as this is
			// ... driven from the first set of search results we get back from Google
			// add "more" button
			_moreBtn = createButton("More", "mapsed-more-button, mapsed-control-button");
			// Start disabled
			// ... (only comes into effect if there are multiple results following a search)
			_moreBtn.disabled = true;
			_searchBarContainer.appendChild(_moreBtn);
		} // addSearch


		/**
		 * Adds a "+" icon to the top right of the map, allowing new places to
		 * added to the map
		 * @returns none
		 */
		function addNewPlaceButton() {
			if (_addBtn)
				// already done
				return;

			_addBtn = createButton(
				settings.ToolbarButtons.AddPlace,
				"mapsed-add-button, mapsed-control-button, mapsed-toolbar-button",
				onPlaceAdd
			);
			_toolbarContainer.appendChild(_addBtn);

		} // addNewPlaceButton


		/**
		 * When in full window mode we need a close button so users can exit
		 * the map (without having to select a place).
		 * @returns none
		 */
		function addCloseButton() {
			if (_closeBtn)
				// already done
				return;

			var onCloseEvent = function (evt) {
				evt.preventDefault();

				if (!_fullWin)
					// already closed
					return;

				var closeMap = true;
				if (settings.onClose) {
					closeMap = settings.onClose(_plugIn);
				}
				// Only close maps mapsed created
				// ... if caller created the DIV, it's up to them to destroy
				// ... (they may want to hide rather than kill)
				if (closeMap && _fullWin) {
					_plugIn.closeMap();
				}
				// else 
				// nothing to do, leave map in place as it was
			};

			_closeBtn = createButton(
				settings.ToolbarButtons.CloseMap,
				"mapsed-close-button, mapsed-control-button, mapsed-toolbar-button",
				onCloseEvent
			);
			_toolbarContainer.appendChild(_closeBtn);

			// With lightbox type functionality, it's traditional to let the ESCape key close it too
			$("body").on("keyup", function (evt) {
				evt.preventDefault();
				if (evt.which == 27/*ESCape*/)
					onCloseEvent(evt);
			});

		} // addCloseButton


		/**
		 * Adds a geo location button to the map, which the user can click to set their
		 * location based on their geo-location.
		 * @returns none
		 */
		function addGeoLocationButton() {
			if (_geoBtn)
				// already added
				return;

			var onClickEvent = function (evt) {
				_plugIn.setMapCentreByGeo();
			};

			_geoBtn = createButton(
				settings.ToolbarButtons.Geo,
				"mapsed-geo-button, mapsed-control-button, mapsed-toolbar-button",
				onClickEvent
			);
			_toolbarContainer.appendChild(_geoBtn);

		} // addGeoLocationButton


		/**
		 * Places a help (?) icon at the top right of the map, allowing
		 * instructions to be added to the end user of the map
		 * @returns none
		 */
		function addHelpButton() {
			if (_helpDlg)
				// already done
				return;

			_helpBtn = createButton(
				settings.ToolbarButtons.Help,
				"mapsed-help-button, mapsed-control-button, mapsed-toolbar-button",
				function (evt) {
					evt.preventDefault();

					// show/hide the dialog
					_helpDlg.fadeToggle();
					if (_helpBtn.classList.contains("open")) {
						_helpBtn.classList.remove("open");
					} else {
						_helpBtn.classList.add("open");
					}
				}
			);
			_toolbarContainer.appendChild(_helpBtn);

			var helpHtml = settings.getHelpWindow();
			_helpDlg = $(helpHtml).appendTo(_mapContainer).click(function () {
				$(this).fadeOut();
				_helpBtn.classList.remove("open");
			});
			_helpDlg.fadeOut();

		} // addHelpButton


		/**
		 * Convenience function for creating control buttons on the map (re-uses
		 * the public "addMapContainer" method.  This is just a short-cut for buttons
		 * @param {any} buttonText Text to appear in the button
		 *                         You can also add a tooltip by prefixing it with a pipe, e.g. "Go|Perform a search" will give
		 *                         a tooltip of "Perform a search"
		 * @param {any} ctrlPos Where on the map the control should be added (TOP_LEFT, TOP_RIGHT, etc)
		 *                      For options, see https://developers.google.com/maps/documentation/javascript/controls#ControlPositioning
		 * @param {any} addClass Additional classes to add to the button (to target CSS)
		 * @param {any} onClickEvent Callback to execute when the button is clicked
		 * @returns Element of the button add (DOM element, not jQuery)
		 */
		function addToolBarButton(buttonText, ctrlPos, addClass, onClickEvent) {
			var btn = null,
				classes = "",
				tooltip = ""
			;

			if (addClass && addClass.length > 0) {
				classes = ` class='${addClass}' `;
			}

			// see if there's a tooltip added
			if (buttonText && buttonText.length > 0) {
				var arrSplit = buttonText.split("|");
				buttonText = arrSplit[0];
				tooltip = arrSplit[1];
			}

			var btn = document.createElement("BUTTON");
			var classArray = addClass.split(" ");
			btn.classList.add(...classArray);
			btn.innerHTML = buttonText;
			btn.setAttribute("title", tooltip);
			if (onClickEvent) {
				btn.addEventListener("click", onClickEvent);
			}
			_toolbarContainer.appendChild(btn);

			return btn;

		} // addToolBarButton


		/**
		 * Closes all marker tooltips that are on-screen.
		 */
		function closeTooltips() {
			if (_markers && _markers.length > 0) {
				for (var i = 0; i < _markers.length; i++) {
					var current = _markers[i];
					if (current.tooltip)
						current.tooltip.close();
				}
			}

		} // closeTooltips


		/**
		 * Helper method to create a new marker.
		 * @param {string} title Tooltip when hovering over the marker on the map (before the dialog tooltip is displayed)
		 * @param {google LatLng object} latLng Detailing where the marker should be placed
		 * @param {any} isDraggable Flags the marker should be draggable (only used when adding new custom markers)
		 * @param {any} type Internal flag for the plug-in, can be:
		 *   new - Marker is for a new "custom" place that is not yet know about
		 *   google - Marker is derived from Google Places API (result from a Places search)
		 *   custom - Marker is one specified by the calling application.
		 *            Note: A marker can start as "new", but once the application is told about it
		 *            it becomes "custom" - notion being the application has saved it to their DB.
		 * @returns
		 */
		function createMarker(title, latLng, isDraggable, type) {
			var image = null;

			if (settings.getMarkerImage) {
				image = settings.getMarkerImage(_plugIn, type, title);
			}

			var marker = new gm.Marker({
				map: _gMap,
				icon: image,
				title: title,
				animation: gm.Animation.DROP,
				position: latLng,
				markerType: type,
				draggable: isDraggable
			});

			// create a default details object too
			marker.details = {
				markerType: type,
				// isLoaded basically means the extended place data has been loaded
				// ... this is only relevant to places that have come from google, not 
				// ... "custom" or "new" ones
				isLoaded: (type != "google"),
				lat: latLng.lat(),
				lng: latLng.lng(),
				userData: "",
				place_id: "",
				name: "",
				street: "",
				town: "",
				area: "",
				postCode: "",
				country: "",
				telNo: "",
				website: "",
				url: "",
				canDelete: (type == "new" || type == "custom"),
				canEdit: (type == "new" || type == "custom")
			};

			return marker;

		} // createMarker


		/**
		 * Builds up the content for an InfoWindow object, which builds up the
		 * read-only and read-write view templates ready for when the tooltip
		 * is shown.
		 * @param {any} forMarker Marker element to attach tooltip to
		 * @returns jQuery element tooltip was attached to
		 */
		function attachTooltip(forMarker) {
			if (forMarker.id) {
				// already created, so return
				var item = $(`#mapsed-${forMarker.id}`);
				return item;
			}

			// not yet created, so add to body
			var newId = _markers.length + 1;
			var d = forMarker.details;
			forMarker.id = newId;

			var item = $(
`<div id='mapsed-${newId}' class='mapsed-root'>
	<input type='hidden' class='mapsed-lat' value='${forMarker.position.lat()}' />
	<input type='hidden' class='mapsed-lng' value='${forMarker.position.lng()}' />
	<input type='hidden' class='mapsed-can-edit' value='${d.canEdit}' />
	<input type='hidden' class='mapsed-can-delete' value='${d.canDelete}' />
	<input type='hidden' class='mapsed-place-id' value='${d.place_id}' />
	<input type='hidden' class='mapsed-user-data' value='${d.userData}' />
	<input type='hidden' class='mapsed-marker-type' value='${forMarker.markerType}' />
	${getViewTemplate()}
	${getEditTemplate()}
</div>`
			);

			forMarker.tooltip = new gm.InfoWindow();
			forMarker.tooltip.setContent(item[0]);
			// we'll still need a reference to the marker later on
			forMarker.tooltip.marker = forMarker;
			forMarker.showTooltip = showTooltip;

			return item;

		} // createTooltip


		/**
		 * Handles the showing of the appropriate tooltip, depending
		 * on whether we're in "edit" or "read" mode.
		 * Also attempts to get more detailed place information from the
		 * Google Places API if it can (only done once per tooltip).
		 * @param {any} inRwMode Flags whether tooltip is showing the edit template (true) or the view template (false)
		 * @returns none
		 */
		function showTooltip(inRwMode) {
			var marker = this;
			if (!marker.tooltip) {
				// not sure why but this can happen
				marker.tooltip = new gm.InfoWindow();
			}
			var tip = marker.tooltip;
			var model = marker.details;
			var $ele = $(tip.content);
			var $ro = $ele.find(".mapsed-view");
			var $rw = $ele.find(".mapsed-edit");
			var settings = _plugIn.getSettings();

			// If we're previously got the place details, or it's a "custom" place
			// we're ok, otherwise we'll have to shoot off and get the main details
			if (!model.isLoaded) {
				// don't have full details yet, so go get them
				getPlaceDetails(marker,
					function (forM) {
						marker.showTooltip(inRwMode);
					}
				);

				// terminate here, we'll pick up where we left off once we have the details
				return;
			}

			// continue displaying the tooltip
			$rw.toggle(inRwMode);
			$ro.toggle(!inRwMode);

			// ensure we have a _clean_ model to play with
			sanitise(model);

			// Do we have any header/footer customisation for _this_ typeof marker
			var renderOptions = {};

			if (settings.getHeaderTemplate) {
				renderOptions.header = settings.getHeaderTemplate(marker, inRwMode);
			}
			if (settings.getFooterTemplate) {
				renderOptions.footer = settings.getFooterTemplate(marker, inRwMode);
			}

			if (inRwMode) {
				// re-apply template
				var tmpl = getEditTemplate();
				applyTemplate(tmpl, model, renderOptions, $rw);

			} else {
				// re-apply template
				var tmpl = getViewTemplate();
				applyTemplate(tmpl, model, renderOptions, $ro);
				hideEmpty(model, $ro);
			}

			tip.close();
			// re-open for the right width to be used
			tip.open(_gMap, marker);

			// flag which marker is open (so we can toggle off later)
			_selectedMarker = marker;
		} // showTooltip


		/**
		 * Template for the read-only view.
		 * @returns View template string
		 */
		function getViewTemplate() {
			// tables!, yes I know, I know.  In my defence "proper" CSS 
			// proved to be too unreliable when used with map tooltips!
			var html =
`<table class='mapsed-container mapsed-view'>
	<tr class='mapsed-view-header'>
		<td colspan='3'>{HEADER}</td>
	</tr>
	<tr>
		<td colspan='3'>
			<h1 class='mapsed-name' title='{NAME}'>{SHORT_NAME}</h1>
		</td>
	</tr>
	<tr>
		<td class='mapsed-left'>
			<address>
				<div class='mapsed-street'>{STREET}</div>
				<div class='mapsed-town'>{TOWN}</div>
				<div class='mapsed-area'>{AREA}</div>
				<div class='mapsed-postCode'>{POSTCODE}</div>
				<div class='mapsed-country'>{COUNTRY}</div>
			</address>
			<a class='mapsed-telNo'   href='tel:{TELNO}'>{TELNO}</a>
			<a class='mapsed-website' href='{WEBSITE}' title='{WEBSITE}'>website</a>
			<a class='mapsed-url'     href='{MORE}'    title='{MORE}'>more</a>
		</td>
		<td class='mapsed-photo'>
			<a href='{MORE}'>{IMG src='{PHOTOURL}' /></a>
		</td>
		<td class='mapsed-add-info'>
			{ADD_INFO}
		</td>
	</tr>
	<tr class='mapsed-buttons'>
		<td colspan='3'>
			<span class='mapsed-action-buttons'>
				<button class='mapsed-select-button'>${settings.ActionButtons.Select}</button>
				<button class='mapsed-edit-button'>${settings.ActionButtons.Edit}</button>
				<button class='mapsed-delete-button'>${settings.ActionButtons.Delete}</button>
			</span>
			<span class='mapsed-paging-buttons'>
				<button class="mapsed-prev-marker">&lt;</button>
				<button class="mapsed-next-marker">&gt;</button>
			</span>
		</td>
	</tr>
	<tr class='mapsed-view-footer'>
		<td colspan='3'>{FOOTER}</td>
	</tr>
</table>`;

			return html;

		} // getViewTemplate


		/**
		 * Template for the read-write view.
		 * @returns Edit template string
		 */
		function getEditTemplate() {
			var html =
`<div class='mapsed-container mapsed-address-entry mapsed-edit'>
	{HEADER}
	<h1>Place details:</h1>
	<ul>
		<li>
		<label>Name
		<input class='mapsed-name' type='text' placeholder='e.g. Bob sandwich shop' value='{NAME}' />
		</label>
		</li>
	<li>
		<label>Street
		<input class='mapsed-street' type='text' placeholder='e.g. 3 Hemington place' value='{STREET}' />
		</label>
	</li>
	<li>
		<label>Town
		<input class='mapsed-town' type='text' placeholder='e.g. Leeds' value='{TOWN}' />
		</label>
	</li>
	<li>
		<label>Area
		<input class='mapsed-area' type='text' placeholder='e.g. West Yorkshire' value='{AREA}' />
		</label>
	</li>
	<li>
		<label>Postcode
		<input class='mapsed-postCode' type='text' value='{POSTCODE}' />
		</label>
	</li>
	<li>
		<label>Country
		<input class='mapsed-country' type='text' value='{COUNTRY}' />
		</label>
	</li>
	<li>
		<label>Tel No
		<input class='mapsed-telNo' type='telephone' placeholder='contact telephone number' value='{TELNO}' />
		</label>
	</li>
	<li>
		<label>website
		<input class='mapsed-website' type='url' placeholder='e.g. https://toepoke.co.uk' value='{WEBSITE}' />
		</label>
	</li>
	<li>
		<label>more url
		<input class='mapsed-url' type='url' placeholder='e.g. https://www.youtube.com/@toepoke_co_uk' value='{MORE}' />
		</label>
	</li>
	</ul>
	<div class='mapsed-buttons'>
		<button class='mapsed-save-button'>${settings.ActionButtons.Save}</button>
		<span class='mapsed-error'>&nbsp;</span>
	</div>
	{FOOTER}
</div>`;

			return html;

		} // getEditTemplate


		/**
		 * Creates a model from the view.  The "view" can be the
		 * read-only select view, or the read-write editor view, the method
		 * works out which is appropriate
		 * @param {any} $vw jQuery element to take model data from
		 * @returns Extracted data model
		 */
		function getViewModel($vw) {
			var $root = $vw.parents(".mapsed-root");
			var model = {
				canEdit: ($root.find(".mapsed-can-edit").val() === "true"),
				canDelete: ($root.find(".mapsed-can-delete").val() === "true"),
				lat: $root.find(".mapsed-lat").val(),
				lng: $root.find(".mapsed-lng").val(),
				place_id: $root.find(".mapsed-place-id").val(),
				markerType: $root.find(".mapsed-marker-type").val(),
				userData: $root.find(".mapsed-user-data").val()
			};

			if ($vw.hasClass("mapsed-view")) {
				// select view
				// for "name" => title has full length version
				model.name = $vw.find(".mapsed-name").attr("title");
				model.street = $vw.find(".mapsed-street").html();
				model.town = $vw.find(".mapsed-town").html();
				model.area = $vw.find(".mapsed-area").html();
				model.postCode = $vw.find(".mapsed-postCode").html();
				model.country = $vw.find(".mapsed-country").html();
				model.telNo = $vw.find(".mapsed-telNo").html();
				model.website = $vw.find(".mapsed-website").attr("href");
				model.url = $vw.find(".mapsed-url").attr("href");

			} else {
				// editor view
				model.name = $vw.find(".mapsed-name").val();
				model.street = $vw.find(".mapsed-street").val();
				model.town = $vw.find(".mapsed-town").val();
				model.area = $vw.find(".mapsed-area").val();
				model.postCode = $vw.find(".mapsed-postCode").val();
				model.country = $vw.find(".mapsed-country").val();
				model.telNo = $vw.find(".mapsed-telNo").val();
				model.website = $vw.find(".mapsed-website").val();
				model.url = $vw.find(".mapsed-url").val();
			}
			// make sure we aren't returning "undefined" somewhere 
			// ... which can happen if we're in a view that doesn't have a telNo for instance
			sanitise(model);

			return model;

		} // getViewModel


		// some of these might not be there (e.g. showOnLoad not passing a telephone number through)
		// ... so make sure the data we return is sensible
		function sanitise(place) {
			if (!place.canEdit) place.canEdit = false;
			if (!place.canDelete) place.canDelete = false;
			if (!place.lat) place.lat = 0;
			if (!place.lng) place.lng = 0;
			if (!place.userData) place.userData = "";
			if (!place.name) place.name = "";
			if (!place.street) place.street = "";
			if (!place.town) place.town = "";
			if (!place.area) place.area = "";
			if (!place.postCode) place.postCode = "";
			if (!place.country) place.country = "";
			if (!place.telNo) place.telNo = "";
			if (!place.website) place.website = "";
			if (!place.url) place.url = "";

		} // sanitise


		/**
		 * Draws any custom places on the map when the map is first drawn.
		 * @see settings.showOnLoad
		 */
		function addInitialPlaces() {
			var placeDetails = [],
				bounds = new gm.LatLngBounds()
				;

			clearMarkers();

			// "showOnLoad" can be specified as an array or a single object, so if it's the
			// latter, we'll use the former
			var places = [];
			var pos = defaults.DEFAULT_CENTER;

			if ($.isArray(settings.showOnLoad))
				places = settings.showOnLoad;
			else
				places.push(settings.showOnLoad);

			for (var i = 0; i < places.length; i++) {
				var p = places[i],
					markerType = ""
				;

				pos = new gm.LatLng(p.lat, p.lng);
				if (p.place_id && p.place_id.length > 0) {
					// we'll get the details from Google
					markerType = "google";
				} else {
					// coming from our own DB
					markerType = "custom";
				}

				addMarker(p, pos, markerType, bounds);
			}

			// we done?
			if (settings.forceCenter) {
				// Callee wants to position at a _specific_ lat/lng
				_gMap.setCenter(settings.mapOptions.center);

			} else if (places.length > 0) {
				// Just centre on the last place added ()
				// ... of course if there's only one we'll centre on that one
				_gMap.setCenter(pos);

			} else {
				// Nothing else to go on, use the default
				_gMap.setCenter(defaults.DEFAULT_CENTER);
			}

		} // addInitialPlaces


		/**
		 * Performs a search on the map for the given search string, drawing
		 * the results on the map
		 * @param {any} searchFor Text string to search Google Places API for
		 * @returns none
		 */
		function doSearch(searchFor) {
			var boundary = _gMap.getBounds();
			var location = null;
			var re = /(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)/gi; 	// regex for lat/lng co-ords
			var query = searchFor;

			if (!searchFor || searchFor == "") {
				_plugIn.showMsg("Search", "No search criteria has been entered");
				return;
			}

			// ensure the search box reflects what's been search for
			_searchBox.value = searchFor;

			// reset the result page count (as we're starting afresh with a new search)
			_pageNum = 0;

			var latLngMatches = query.match(re);

			if (latLngMatches) {
				// add a location
				location = latLngMatches[0];
				// remove the lat/lng from the search (otherwise causes issues with maps search)
				query = query.replace(re, "");
				// remove any "near" reference
				query = query.replace("near", "");
			}

			var request = {
				query: $.trim(query),
				// limit to search to boundary of the map screen
				bounds: boundary
			};

			if (location) {
				request.location = location;
			}

			_placesApi.textSearch(request, gmPlaceSelected);

		} // doSearch


		/**
		 * The "address_components" object provided by the API is quite, erm
		 * "extensive".  This cuts it down into something a little more
		 * usable for our purposes.
		 * 
		 * @param {any} details object to be normalised (this is a Google Places result)
		 * @param {any} fromGP hit from the Google Places API (to take data from)
		 */
		function normalisePlacesApiAddress(details, fromGP) {
			var ac = fromGP.address_components;

			// Copy Googles version of an address to something more useable for us
			var street = findPart(ac, "street_address");
			if (street === "") {
				// not present so fallback to "route"
				street = findPart(ac, "route");
			}

			var town = findPart(ac, "locality"),
				area = findPart(ac, "administrative_area_level_1"),
				postCode = findPart(ac, "postal_code"),
				country = findPart(ac, "country")
				;

			details.street = street;
			details.town = town;
			details.area = area;
			details.postCode = postCode;
			details.country = country;

			// and some other bits
			details.name = fromGP.name || "";
			if (fromGP.photos && fromGP.photos.length > 0)
				details.photo = fromGP.photos[0];
			details.url = fromGP.url || "";
			details.website = fromGP.website || "";
			details.telNo = fromGP.formatted_phone_number || fromGP.telNo || "";

		} // normalisePlacesApiAddress


		/**
		 * Converts a single string address into it's component parts for 
		 * the data model
		 * @param {any} details Data model object to be populated
		 * @param {any} src CSV address to extract data from
		 * @returns none
		 */
		function normaliseFormattedAddress(details, src) {
			if (!src)
				return;
			var elements = src.split(",");

			// pure guess!
			if (elements.length >= 1)
				details.street = $.trim(elements[0]);
			if (elements.length >= 2)
				details.town = $.trim(elements[1]);
			if (elements.length >= 3)
				details.area = $.trim(elements[2]);
			if (elements.length >= 4)
				details.postCode = $.trim(elements[3]);
			if (elements.length >= 5)
				details.country = $.trim(elements[4]);
		}


		/**
		 * Convenience function for finding parts of the address
		 * @param {any} addressParts Google Places address to find part from
		 * @param {any} typeName What to search for
		 * @param {any} getShortVersion Flags whether short version of data should be returned (true), false returns long version
		 * @returns Part data found
		 */
		function findPart(addressParts, typeName, getShortVersion) {
			if (addressParts == null || addressParts.length == 0)
				// address not available
				return "";

			var value = "";

			for (var i = 0; i < addressParts.length; i++) {
				var item = addressParts[i],
					found = false
					;

				for (var j = 0; j < item.types.length; j++) {
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

		} // findPart


		//
		// Initialisers
		//

		/**
		 * Constructor
		 */
		var ctor = function () {
			var containerId = null;

			// Set up Google API namespace references
			gm = google.maps;
			gp = google.maps.places;

			containerId = _mapContainer.attr("id");
			_gMap = new gm.Map(
				document.getElementById(containerId),
				settings.mapOptions
			);
			if (settings.disablePoi) {
				// Turns off Points-of-view 
				// ... (i.e. the default Google clicks you usually get in Google Maps)
				_plugIn.disablePointsOfInterest();
			}
			_placesApi = new gp.PlacesService(_gMap);
			_instance = _plugInInstances++;

			if (settings.onSelect) {
				_mapContainer.on("click", "button.mapsed-select-button",
					function () {
						var element = $(this);
						onPlaceSelect(element);
					}
				);
			}
			if (settings.onSave) {
				_mapContainer.on("click", "button.mapsed-save-button",
					function () {
						var element = $(this);
						onPlaceSave(element);
					}
				);
				// only allow edit if the user can actually save the result!
				_mapContainer.on("click", "button.mapsed-edit-button",
					function () {
						var element = $(this);
						onPlaceEdit(element);
					}
				);
			}
			if (settings.onAddSave) {
				_mapContainer.on("click", "button.mapsed-save-button",
					function () {
						var element = $(this);
						onPlaceSave(element);
					}
				);
			}
			if (settings.onDelete) {
				_mapContainer.on("click", "button.mapsed-delete-button",
					function () {
						var element = $(this);

						if (settings.confirmDelete) {
							var $vw = element.parents(".mapsed-view");
							var model = getViewModel($vw);
							var msg = `<strong>${model.name}</strong> will be deleted.`;
							_plugIn.confirmMsg("Confirm Delete", msg,
								"Are you sure?",
								// callback only fired if "Yes" is selected
								function () {
									onPlaceDelete(element);
								}
							);
						} else {
							onPlaceDelete(element);
						}
					}
				);
			}

			// add toolbar
			var toolbarContainerHtml =
"<div id='mapsed-toolbar' class='mapsed-toolbar-container'></div>";
			_toolbarContainer = _plugIn.addMapContainer(toolbarContainerHtml, defaults.MAPSED_CONTROLBAR_POSITION);

			var searchBarContainerHtml =
"<div id='mapsed-searchbar-container' class='mapsed-searchbar-container'></div>";
			_searchBarContainer = _plugIn.addMapContainer(searchBarContainerHtml, defaults.MAPSED_SEARCH_CONTROLBAR_POSITION);

			// position geo before the search bar (works better me thinks)
			if (settings.allowGeo) {
				addGeoLocationButton();
			}
			if (settings.searchOptions.enabled) {
				addSearch();
			}
			if (_fullWin || settings.onClose) {
				addCloseButton();
			}
			if (settings.showOnLoad != null) {
				addInitialPlaces();
			}
			if (settings.getHelpWindow) {
				addHelpButton();
			}
			if (settings.onAddSave) {
				addNewPlaceButton();
			}
			if (settings.onPreInit) {
				settings.onPreInit(_plugIn);
			}

			gm.event.addListener(_gMap, "idle", gmIdle);
			gm.event.addListener(_gMap, "tilesloaded", function (evt) {
				// tiles_loaded event is still too early to initialise the map
				// so give it another second to finish up before we initialise ourselves
				if (_hasMapInitFired)
					// already wired up
					return;

				gmMapLoaded();

				// flag it's been done
				_hasMapInitFired = true;

				if (settings.onInit) {
					settings.onInit(_plugIn);
				}
			});

			var so = settings.searchOptions;
			if (so.enabled && so.initSearch && so.initSearch.length > 0) {
				doSearch(so.initSearch);
			}

			// Apply the zoom and center (otherwise GM won't know where to draw it's map! and you'll just get a grey box)
			_gMap.setZoom(settings.mapOptions.zoom);
			_gMap.setCenter(settings.mapOptions.center);

			var plugger = 'plugin_' + _plugInName;
			if (!_mapContainer.data(plugger)) {
				_mapContainer.data(plugger, _plugIn);
			}

		} // ctor


		// Selector entry point
		this.each(function () {
			_mapContainer = $(this);

			ctor();

		}); // each

		// Full screen entry point
		if (!this.length) {
			var mapId = "mapsed-full-window",
				_mapContainer = $(`#${mapId}`)	// see if we've already added one
				;
			if (!_mapContainer.length) {
				_mapContainer = $("<div id='mapsed-full-window' class='mapsed-full-window'></div>");
				_mapContainer.appendTo("body");
			}
			// flag we're in full window mode
			_fullWin = true;

			ctor();
		}

		// for jQuery chain-ability
		return this;
	}; // tooltips

})(jQuery);

