// Custom Google Maps style
// This one is taken from the excellent "snappy maps" website:
// 	http://snazzymaps.com/style/35/avocado-world
var _avocadoStyle = [{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#aee2e0"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#abce83"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#769E72"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#7B8758"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#EBF4A4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#8dab68"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#5B5B3F"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ABCE83"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#A4C67D"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#9BBF72"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#EBF4A4"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#87ae79"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#7f2200"},{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"visibility":"on"},{"weight":4.1}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#495421"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]}];

// List of places to list on the map on load
// ... prob derived from a db of some kind
// ... Note you don't have to supply _all_ the data below (well you _do_ have supply lat/lng!), 
// ... just what you have available

var _myPlaces = [
	// North Bar, Leeds
	{
		lat: 53.796592,
		lng: -1.543926,
		// reference should be a unique reference in "your system"
		// If the user "selects" this place, this is used to map back to these details
		reference: "sldfkjsdlkfj",
		name: "The Former Bond Street Shopping Centre",
		address_components: {
			street_address: "Albion Street,",
			locality: "Leeds",
			administrative_area_level_1: "West Yorkshire"
		}
	},
	// City Varieties
	{
		lat: 53.798823,
		lng:-1.5426760000000286,
		reference: "CoQBfAAAAPw-5BTCS53grSLDwX8rwo5BnWnEWnA72lmOjxdgWg2ODGfC5lLjGyoz428IEaln1vJ6rq1jI96Npzlm-N-wmPH2jdJMGfOLxno_rmgnajAnMPzNzuI8UjexIOdHVZPBPvQGloC-tRhudGeKkbdTT-IWNP5hp4DIl4XOLWuYFOVYEhBxNPxaXZdW9uhKIETXf60hGhTc9yKchnS6oO-6z5XZJkK2ekewYQ",
		name: "City Varieties Music Hall",
		url: "https://plus.google.com/103655993956272197223/about?hl=en-GB",
		website: "http://www.cityvarieties.co.uk/",
		formatted_phone_number: "0845 644 1881",
		address_components: {
			street_address: "Swan Street,",
			locality: "Leeds",
			administrative_area_level_1: "West Yorkshire",
			postal_code: "LS1 6LW",
			telephone: "0845 644 1881"
		}
	}
];

