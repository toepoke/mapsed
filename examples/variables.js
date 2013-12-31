// Custom Google Maps style
// This one is taken from the excellent "snappy maps" website:
// 	http://snazzymaps.com/style/35/avocado-world
var _avocadoStyle = [{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#aee2e0"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#abce83"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#769E72"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#7B8758"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#EBF4A4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#8dab68"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#5B5B3F"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ABCE83"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#A4C67D"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#9BBF72"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#EBF4A4"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#87ae79"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#7f2200"},{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"visibility":"on"},{"weight":4.1}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#495421"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]}];

var _snazzyMaps = [
	{
		"name": "Avocado",
		"theme":
			_avocadoStyle
	}
	,
	{	
		"name": "Pale Dawn",
		"theme": 
			[{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"landscape","stylers":[{"color":"#f2e5d4"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"road"},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{},{"featureType":"road","stylers":[{"lightness":20}]}]
	}
	,
	{
		"name": "Blue water",
		"theme":
			[{"featureType":"water","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"landscape","stylers":[{"color":"#f2f2f2"}]},{"featureType":"road","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]}]
	}

];

// List of places to list on the map on load
// ... prob derived from a db of some kind
// ... Note you don't have to supply _all_ the data below (well you _do_ have supply lat/lng!), 
// ... just what you have available

var _roPlaces = [
	// North Bar, Leeds
	{
		// flags the user can edit this place
		canEdit: false,
		lat: 53.796592,
		lng: -1.543926,
		// "reference" should be a unique reference in "your system"
		// If the user "selects" this place, this is used to map back to these details
		reference: "sldfkjsdlkfj",
		name: "The Former Bond Street Shopping Centre",
		street: "Albion Street,",
		town: "Leeds",
		area: "West Yorkshire"
	},
	// City Varieties
	{
		// flag that this place should have the tooltip shown when the map is first loaded
		autoShow: true,
		// flags the user can edit this place
		canEdit: false,
		lat: 53.798823,
		lng:-1.5426760000000286,
		reference: "CoQBfAAAAPw-5BTCS53grSLDwX8rwo5BnWnEWnA72lmOjxdgWg2ODGfC5lLjGyoz428IEaln1vJ6rq1jI96Npzlm-N-wmPH2jdJMGfOLxno_rmgnajAnMPzNzuI8UjexIOdHVZPBPvQGloC-tRhudGeKkbdTT-IWNP5hp4DIl4XOLWuYFOVYEhBxNPxaXZdW9uhKIETXf60hGhTc9yKchnS6oO-6z5XZJkK2ekewYQ",
		name: "City Varieties Music Hall",
		url: "https://plus.google.com/103655993956272197223/about?hl=en-GB",
		website: "http://www.cityvarieties.co.uk/",
		telNo: "0845 644 1881",
		street: "Swan Street,",
		town: "Leeds",
		area: "West Yorkshire",
		postCode: "LS1 6LW"
	}
];

var _rwPlaces = [
	// North Bar, Leeds
	{
		// "canEdit" flags that the user can edit the contents of this place
		// once the user has finished editing you will get the "onEditOK" event
		// 
		autoShow: true,
		canEdit: true,
		lat: 53.796592,
		lng: -1.543926,
		// "reference" should be a unique reference in "your system"
		// If the user "selects" this place, this is used to map back to these details
		reference: "one",
		name: "The Former Bond Street Shopping Centre",
		street: "Albion Street,",
		town: "Leeds",
		area: "West Yorkshire"
	},
	// City Varieties
	{
		autoShow: true,
		canEdit: true,
		lat: 53.798823,
		lng:-1.5426760000000286,
		//reference: "CoQBfAAAAPw-5BTCS53grSLDwX8rwo5BnWnEWnA72lmOjxdgWg2ODGfC5lLjGyoz428IEaln1vJ6rq1jI96Npzlm-N-wmPH2jdJMGfOLxno_rmgnajAnMPzNzuI8UjexIOdHVZPBPvQGloC-tRhudGeKkbdTT-IWNP5hp4DIl4XOLWuYFOVYEhBxNPxaXZdW9uhKIETXf60hGhTc9yKchnS6oO-6z5XZJkK2ekewYQ",
		reference: "two",
		name: "CITY Varieties Music Hall",
		url: "https://plus.google.com/103655993956272197223/about?hl=en-GB",
		website: "http://www.cityvarieties.co.uk/",
		telNo: "0845 644 1881",
		street: "Swan Street,",
		town: "Leeds",
		area: "West Yorkshire",
		postCode: "LS1 6LW"
	},
	// No info
	{
		autoShow: true,
		canEdit: true,
		lat: 53.79,
		lng: -1.59,
		reference: "three",
		name: "Somewhere",
		street: "Over the rainbow,"
	}
];

