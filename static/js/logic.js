// Import the data and create Leaflet map
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson").then(function(data) {
	var Map = L.map("map", {
        zoom: 5
    });
	
// Create layers 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(Map);

// Create function for colour depth
	function getcolour(d) {
        return d > 90 ? '#6a329f' :
               d > 70 ? '#c90076' :
               d > 50 ? '#3d85c6' :
               d > 30 ? '#f6b26b' :
               d > 10 ? '#b6d7a8' :
                        '#ffe599';
    }

// Create function for colour depth legend
	function createlegend() {
        var colourlegend = L.control({ position: 'bottomright' });
        colourlegend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            var depths = [0, 10, 30, 50, 70, 100];
            div.innerHTML += '<b>Depth (km)</b><br>';
            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                    (depths[i + 1] ? depths[i] + '&ndash;' + depths[i + 1] + '<br>' : depths[i] + '+');
            }
            return div;
        };
        legend.addTo(Map);
    }

// Create earthquake markers on map
function markers(response) {

	// Convert response data into array
	var datastation = response.features;

	// Create variable for earthqake markers
	var earthquakemarkers = [];

	// Create for loop to cycle through data stations
	for (var index = 0; index < datastation.length; index++) {
		var dstation = datastation[index];
		var lat = datastation[index].geometry.coordinates[1];
		var lng = datastation[index].geometry.coordinates[0];
		var depth = datastation[index].geometry.coordinates[2];
		var mag = datastation[index].properties.mag;
		var title = datastation[index].properties.title;
		if (depth < 0){
			depth = 0;
		}
		var colourdepth = getcolour(depth)

    // Iterate through data stations and create marker and popup
    var emarker = L.circleMarker([lat, lng], {
      fillOpacity: 0.8,
      color: "black",
      fillColor: getColor(depth),
      radius: mag * 5,
    }).bindPopup("<h3>Earthquake Depth: " + depth + "<br> Magnitude: " + mag + "</h3>")
	.addTo(Map);

    // Push new marker to earthquake marker array
    earthquakemarkers.push(emarker);
	
	// Call the createlegend function
	createlegend();
  });
  