# mappy.js

On **[my website](http://toepoke.co.uk/)** I needed to be able to select places on a map.  

I couldn't find anything that fully did what I was after so I built mappy (besides I need the JavaScript practice!).

In short it provides the following:

* UI for users to "select" a place (you get a callback detailing what they picked)
* UI for adding "custom" places
* Support for firing a map up full-window (without having to create a DIV on the page)
* Add searching to the map
* Add/Edit and update your own "custom places" 
	(i.e. not those in the **[Google Places API](https://developers.google.com/places/documentation/)** doesn't know about, but you do)
* Works with multiple maps on the same page

## Demos
Demos at http://mappy.apphb.com

## Settings

### showOnLoad *(array)*

An array of JSON objects that define a set of markers to display when the map is first loaded.

Each element of the array details a place that should be loaded.  An element can either be a **Custom** place or a **Google** place.

#### Custom Place

A **custom** place is a place only your system knows about.  You know the address details, lat/lng coordinates, etc.  So you have to tell **mappy.js** what they are.  The following is a **custom** example:

```JavaScript
// Random made up CUSTOM place
{
  lat: 53.79,
  lng:-1.5426760000000286,
  name: "Somewhere",
  street: "Over the rainbow, Up high way"
}
```

#### Google Place

A ***Google*** place is one derived from the Google Places database.  Google returns (and mappy.js in turn tells you) [a unique **reference** for a place](https://developers.google.com/places/documentation/search#PlaceSearchResults).  The following is a **Google** place example:

```JavaScript
{
  lat: 53.798823,
  lng:-1.5426760000000286,
  reference: "CoQBfAAAAPw-5BTCS53grSLDwX8rwo5BnWnEWnA72lmOjxdgWg2ODGfC5lLjGyoz428IEaln1vJ6rq1jI96Npzlm-N-wmPH2jdJMGfOLxno_rmgnajAnMPzNzuI8UjexIOdHVZPBPvQGloC-tRhudGeKkbdTT-IWNP5hp4DIl4XOLWuYFOVYEhBxNPxaXZdW9uhKIETXf60hGhTc9yKchnS6oO-6z5XZJkK2ekewYQ"
}
```

**Mappy.js** uses the **reference token** to ask Google for the details (so rather than storing the full info in your database, you just store the **reference**).

The lat/lng coordinates still need to be given to the plugin as it only asks Google for details when a marker is clicked upon (i.e. it queries as required) so it needs to know where the marker should be placed on the map.

[See custom places example](examples/01-custom-places-example.js)

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

[See search places example](examples/05-search-for-places-example.js)

### showHelpOnLoad *(bool)*

Displays the help instructions when the map is first opened (see [getHelpWindowString](#gethelpwindow-string) to discover how to set the content).

[See full-window example](examples/06-full-window.js)

### confirmDelete *(bool)*

Flags that when a user *deletes* a place (activated by the [onDelete](#onDelete) callback) they are asked to confirm the action *before* the [onDelete](#onDelete) callback is issued.

## Events / Callbacks

### onSelect

Fired when the **Select** button is clicked in a place window.

[See place picker example](examples/02-place-picker-example.js)

### onSave

Fired when the **Save** button is clicked in a place window (after adding or editing a place).

[See add places example](examples/03-add-places-example.js)

### onDelete

Fired when the **Delete** button is clicked in a place window.  This gives you the chance to cancel the delete operation if you wish.

This expects a boolean to be returned:
* true - indicates the delete operation should complete.
* false - indicates the delete operation should be cancelled.

[See delete places example](examples/04-delete-places-example.js)

### getHelpWindow *(string)*

If the *getHelpWindow* method is specified, it should return a string of HTML with the help content to display.

The act of coding the method will add the help icon (?) to the controls buttons in the top-right of the map.

[See full-window example](examples/06-full-window.js)

## Dependencies
jQuery (10.2 used in development)
Google Maps library (v3)
Google Places library (v3)

## Source code
The source code is knocked up to satisfy a need.  I'm not advertising it as best practice, but if you think it will benefit you, please feel free to use it.
mappy.js is released under a ''do what you like with it'' license :-)

## Change Log

- **0.0.2 (Planned)**
Nothing planned.

- **0.0.1**
Initial release 
