/**
 * Class to aid debugging without increasing the size of the core 
 * library too much.  Including this file on the web page enables
 * the improved debugging experience.
 */
class MapsedDebug {
	#polygon = null;

	logMarker(mLatName, mLat, x1Name, x1, x2Name, x2) {
		console.log(mLatName, mLat, x1Name, x1, x2Name, x2);
	}

	logger(...args) {
		console.log(args);
	}

	clearLog() {
		console.clear();
	}

	drawNearbyPolygon(onMap, boundaryDef) {
		const markerCoords = [
			{ lat: boundaryDef.x1, lng: boundaryDef.y1 },
			{ lat: boundaryDef.x2, lng: boundaryDef.y1 },
			{ lat: boundaryDef.x2, lng: boundaryDef.y2 },
			{ lat: boundaryDef.x1, lng: boundaryDef.y2 },

			{ lat: boundaryDef.x1, lng: boundaryDef.y1 },
		];

		// Construct the polygon.
		this.#polygon = new google.maps.Polygon({
			paths: markerCoords,
			strokeColor: "#FF0000",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "#FF0000",
			fillOpacity: 0.35,
		});

		this.#polygon.setMap(onMap);
	}

	clearPolygon() {
		if (this.#polygon != null) {
			this.#polygon.setMap(null);
			this.#polygon = null;
		}

	}

}