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

### customPlaces *(array)*

An array JSON objects defining places should should be displayed whe the map is first loaded.

Each element of the array details a place that should be loaded.  These can be detailed in two ways:

* reference property: mappy.js will then load the details via the Google Places API
* address properties: If no "reference" property is expressed the address properties (street, name, town, etc) are used.

[See custom places example](examples/01-custom-places-example.js)

### mapOptions *(object)*

This object is passed onto the Google Maps initialisation, thereby allowing the map to be initialised with further parameters.

### disablePoi *(bool)*

On the Google Map places of interest (POI) can be clicked.  This is the normal behaviour on a Google Map.  Sometimes you may not want to distract your users with POI that isn't part of your audience's concerns.  For instance my website - [my website](http://toepoke.co.uk/) - is geared towards 5-a-side football, so showing locations of cinemas isn't of interest.

### allowAdd *(bool)*

Places an "add place" icon (+) in the top-right of the map which allows the user to add additional places to your map.

The *onSave* callback (see below) must be implemented to capture the place being added so it can be saved.

### searchOptions *(object)*

*searchOptions* is a JavaScript object (i.e. a child object) for defining how search functionality should be added to the map:

#### enabled *(bool)*

Must be true to *turn on* searching - this adds a search textbox onto the map.

#### placeholder *(string)*

Placeholder text to be added to the search textbox.

#### initSearch *(string)*

A search string to pre-populate the search textbox with.  This is executed when the map is loaded and shows the results straight away.

### showHelpOnLoad *(bool)*


## Events / Callbacks

### onSelect

Fired when the **Select** button is clicked in a place window.

### onSave

Fired when the **Save** button is clicked in a place window (after adding or editing a place).

### onDelete

Fired when the **Delete** button is clicked in a place window.  This gives you the chance to cancel the delete operation if you wish.

This expects a boolean to be returned:
* true - indicates the delete operation should complete.
* false - indicates the delete operation should be cancelled.

### getHelpWindow *(string)*

If the *getHelpWindow* method is specified, it should return a string of HTML with the help content to display.

The act of coding the method will add the help icon (?) to the controls buttons in the top-right of the map.


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
