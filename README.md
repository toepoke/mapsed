# mapsed.js

On **[my website](http://toepoke.co.uk/)** I needed to be able to select places on a map.  

I couldn't find anything that fully did what I was after so I built mapsed (besides I need the JavaScript practice!).

In short it provides the following:

* UI for users to "select" a place (you get a callback detailing what they picked)
* UI for adding "custom" places
* Support for firing a map up full-window (without having to create a DIV on the page)
* Add searching to the map
* Add/Edit and update your own "custom places" 
	(i.e. not those in the **[Google Places API](https://developers.google.com/places/documentation/)** doesn't know about, but you do)
* Works with multiple maps on the same page

## Demos
Demos at http://mapsed.apphb.com

## Settings

### showOnLoad *(array)*

An array of JSON objects that define a set of markers to display when the map is first loaded.

Each element of the array details a place that should be loaded.  An element can either be a **Custom** place or a **Google** place.

Note that **showOnLoad** will also accept just one place object, rather than an array (useful if you only want to show one place on your map).

#### Custom Place

A **custom** place is a place only your system knows about.  You know the address details, lat/lng coordinates, etc.  So you have to tell **mapsed.js** what they are.  The following is a **custom** example:

```JavaScript
// Random made up CUSTOM place
{
  userData: 99,
  lat: 53.79,
  lng:-1.5426760000000286,
  name: "Somewhere",
  street: "Over the rainbow, Up high way"
}
```

#### Google Place

A ***Google*** place is one derived from the Google Places database.  Google returns (and mapsed.js in turn tells you) [a unique **reference** for a place](https://developers.google.com/places/documentation/search#PlaceSearchResults).  The following is a **Google** place example:

```JavaScript
{
  lat: 53.798823,
  lng:-1.5426760000000286,
  reference: "CoQBfAAAAPw-5BTCS53grSLDwX8rwo5BnWnEWnA72lmOjxdgWg2ODGfC5lLjGyoz428IEaln1vJ6rq1jI96Npzlm-N-wmPH2jdJMGfOLxno_rmgnajAnMPzNzuI8UjexIOdHVZPBPvQGloC-tRhudGeKkbdTT-IWNP5hp4DIl4XOLWuYFOVYEhBxNPxaXZdW9uhKIETXf60hGhTc9yKchnS6oO-6z5XZJkK2ekewYQ"
}
```

**mapsed.js** uses the **reference token** to ask Google for the details (so rather than storing the full info in your database, you just store the **reference**).

The lat/lng coordinates still need to be given to the plugin as it only asks Google for details when a marker is clicked upon (i.e. it queries as required) so it needs to know where the marker should be placed on the map.

[See custom places example](examples/01-custom-places-example.js)

### getMarkerImage *(function)*

The *getMarkerImage* callback is fired when a marker is added to the map.  It expects a Google Icon object to be returned (see https://developers.google.com/maps/documentation/javascript/reference#Icon).

The method signature for the callback is *getMarkerImage(mapsed, markerType, title)*, where:

<table>
  <tr>
    <th>Parameter</th><th>Description</th>
  </tr>
  <tr>
    <td><strong>mapsed</strong> (object)</td>
    <td>The plug-in calling the method</td>
  </tr>
  <tr>
    <td><strong>markerType</strong> (string)</td>
    <td>
    	The type of marker being added to the map, this can be:<br/>
    	*new* - New marker is being added by user (via the "+" button - see allowAdd)<br/>
    	*google* - Marker being added was derived from the Google Places API<br/>
    	*custom* - Marker being added was derived from the application database, i.e. derived from the showOnLoad array.
    </td>
  </tr>
  <tr>
    <td><strong>mapsed</strong> (bool)</td>
    <td>title attribute of the marker (useful for tracking which marker in an showOnLoad is being drawn).</td>
  </tr>
</table>
 

[See full-window example](examples/06-full-example.js)

### mapOptions *(object)*

This object is passed onto the Google Maps initialisation, thereby allowing the map to be initialised with further parameters.

### disablePoi *(bool)*

On a map, Google adds places of interest hotspots that can be clicked.  These might point to a local park or a cinema and bring up details about that *place*.

Ordinarily this is quite useful, however if it's outside the concern of your audience you may not wish to distract them.  For instance [our audience](http://toepoke.co.uk/) is concerned with football venues, so cinemas aren't of interest to them at that time.

The **disablePoi** setting turns off these point of interest hotspots.  However POI cannot be turned off with [styled maps](https://developers.google.com/maps/documentation/javascript/styling).

### allowAdd *(bool)*

Places an "add place" icon (+) in the top-right of the map which allows the user to add additional places to your map.

The *onSave* callback (see below) must be implemented to capture the place being added so it can be saved.

[See add places example](examples/03-add-places-example.js)

### searchOptions *(object)*

*searchOptions* is a JavaScript object (i.e. a child object) for defining how search functionality should be added to the map:

#### enabled *(bool)*

Must be true to *turn on* searching - this adds a search textbox onto the map.

#### placeholder *(string)*

Placeholder text to be added to the search textbox.

#### initSearch *(string)*

A search string to pre-populate the search textbox with.  This is executed when the map is loaded and shows the results straight away.

### geoSearch *(string)*

Specifies a search to be made when location is based on geo-location position.  This can be when the map is first loaded (#findGeoOnLoad-bool) or when the geo-location button is clicked (#allowgeo-bool).

This search is executed instead of the (#initsearch-string).  Rational being the geo-search needs to be relative to the lat/lng co-ordinates.  For example setting the *geoSearch* string to "Business near {POSITION}" the {POSITION} wildcard is replaced with the lat/lng co-ordinates of the user.

[See search places example](examples/05-search-for-places-example.js)

### allowGeo *(bool)*

Adds a <i>find geo position</i> button to the top left of the map, which when clicked moves the location of the map to the GEO position of the device.

[See full-window example](examples/06-full-example.js)

### findGeoOnLoad *(bool)*

When the map is first loaded the centre of the map is set to the GEO location position of the device.

<i>
If [showOnLoad](#showonload-array) is populated with places, the <strong>findGeoOnLoad</strong> settings is ignored.
This is because the GEO position may be different to where the [showOnLoad](#showonload-array) places are located and the user wouldn't see them.
</i>

### showHelpOnLoad *(bool)*

Displays the help instructions when the map is first opened (see [getHelpWindowString](#gethelpwindow-string) to discover how to set the content).

[See full-window example](examples/06-full-example.js)

### confirmDelete *(bool)*

Flags that when a user *deletes* a place (activated by the [onDelete](#ondelete) callback) they are asked to confirm the action *before* the [onDelete](#ondelete) callback is issued.

[See delete places example](examples/04-delete-places-example.js)

## Place Model

When a given *action* occurs (when a place is [selected](#onselect) for example) a [callback](#events--callbacks) is fired so your application can deal with the event.  

As part of the callback *mapsed* typically passes the data for the place the event was fired for.  For convenience we'll call this the *model* and it will look like this:

<table>
  <tr>
    <th>Property</th><th>Description</th>
  </tr>
  <tr><td>canEdit</td><td>Flags this an <strong>editable</strong> place, i.e. when it's clicked on the map it has an <strong>edit</strong> button.</td></tr>
  <tr><td>lat</td><td>Latitude position of the place.</td></tr>
  <tr><td>lng</td><td>Longitude position of the place.</td></tr>
  <tr><td>reference</td><td>Unique reference to a place in the Google Places database (this is provided by Google), see also <a href="#google-place">Google Place</a></td></tr>
  <tr><td>userData</td><td>
    Some unique identifier to link a marker on the map with a database entity (e.g. primary key).<br/>
    For <strong>new</strong> places this will be empty and should be populated by the <a href="#onsave">onSave callback</a>.<br/><br/>

    <i>A place may have both the <strong>userData</strong> property and the <strong>reference</strong> property populated.  Typically this would be because you're using the <strong>userData</strong> field to lookup the <a href="#google-place"><strong>google place</strong></a> <strong>reference</strong> from your database.</i>
    
  </td></tr>
  <tr>
  <td>markerType</td>
  <td>
  Specifies what mode the marker for the place is in.  Can be:
  <table>
    <tr><td><strong>new</strong></td><td>
      Place has just been created via the [+] icon.  Once saved, this is changed to <strong>custom</custom>.
    </td></tr>
    <tr><td><strong>custom</strong></td><td>
      Place is derived from <i>your</i> database, <u>not</u> Google.
    </td></tr>
    <tr><td><strong>google</strong></td><td>
      Place is dervied from the Google Places API (has a <a href="#google-place">reference</a> property).
    </td></tr>
  </table>
  </td>
  </tr>
  <tr><td>name</td><td>Name of the place (e.g. City Varieties).</td></tr>
  <tr><td>street</td><td>Street the place is on.</td></tr>
  <tr><td>town</td><td>Town the place is in, e.g. Leeds.</td></tr>
  <tr><td>area</td><td>Area the place is in, e.g. West Yorkshire.</td></tr>
  <tr><td>postCode</td><td>Postcode/zipcode of the place, e.g. LS1 6LW</td></tr>
  <tr><td>telNo</td><td>Telephone number of the place.</td></tr>
  <tr><td>website</td><td>Website address of the place.</td></tr>
  <tr><td>url</td><td>Google+ page url</td></tr>
</table>


## Events / Callbacks

### onSelect

Fired when the **Select** button is clicked in a place window.

Callback method signature:
<table>
<tr><th>Parameter</th><th>Description</th></tr>
<tr>
<td>mapsed</td>
<td>Reference to the <strong>mapsed</strong> object so you can call into the plug-in, e.g. <strong>mapsed.showMsg("title", "some message")</strong> will show a modal message on the map</td>
</tr>
<tr>
<td>details</td>
<td>Place details, see <a href="#place-model">Place Model</a> for full details</td>
</tr>
</table>

[See place picker example](examples/02-place-picker-example.js)

### onSave

Fired when the **Save** button is clicked in a place window (after adding or editing a place).

Callback method signature:
<table>
<tr><th>Parameter</th><th>Description</th></tr>
<tr>
<td>mapsed</td>
<td>Reference to the <strong>mapsed</strong> object so you can call into the plug-in, e.g. <strong>mapsed.showMsg("title", "some message")</strong> will show a modal message on the map</td>
</tr>
<tr>
<td>details</td>
<td>Place details, see <a href="#place-model">Place Model</a> for full details</td>
</tr>
</table>

[See add places example](examples/03-add-places-example.js)

### onDelete

Fired when the **Delete** button is clicked in a place window.  If [confirmDelete](#confirmdelete-bool) is enabled the user is prompted for confirmation first.

Callback method signature:
<table>
<tr><th>Parameter</th><th>Description</th></tr>
<tr>
<td>mapsed</td>
<td>Reference to the <strong>mapsed</strong> object so you can call into the plug-in, e.g. <strong>mapsed.showMsg("title", "some message")</strong> will show a modal message on the map</td>
</tr>
<tr>
<td>details</td>
<td>Place details, see <a href="#place-model">Place Model</a> for full details</td>
</tr>
<tr>
<td>Return (bool)</td>
<td>
The <strong>onDelete</strong> callback expects a <strong>boolean</strong> value to be returned.  If <i>your</i> delete operation is successful return <strong>true</strong>, otherwise return <strong>false</strong>.
<br/><br/>
If <i>your</i> callback returns <strong>false</strong> the map marker remains on the map -  which is what you want :-)
</td>
</table>

[See delete places example](examples/04-delete-places-example.js)

### onAdd

Custom method called when the user clicks the "add place" icon (+).  Allows the place details to be populated if required.

Once your code has resolved the place details the *showAddDialog* method must be called for the dialog to be shown on the map (this is necessary as you'll need to do an ajax lookup to find your address details, this allows execution to continue in *mapsed*).

[See full-window example](examples/06-full-example.js)

### showAddDialog *(method)*

Once a new place has been resolved, use *showAddDialog* to have *mapsed* show the resulting dialog.

[See full-window example](examples/06-full-example.js)

### getHelpWindow *(string)*

If the *getHelpWindow* method is specified, it should return a string of HTML with the help content to display.

The act of coding the method will add the help icon (?) to the controls buttons in the top-right of the map.

[See full-window example](examples/06-full-example.js)

## Dependencies
jQuery (10.2 used in development)
Google Maps library (v3)
Google Places library (v3)

## Source code
The source code is knocked up to satisfy a need.  I'm not advertising it as best practice, but if you think it will benefit you, please feel free to use it.
mapsed.js is released under a ''do what you like with it'' license :-)

## Change Log

- **0.0.2 (Planned)**
Nothing planned.

- **0.0.1**
Initial release 
