// Import the data and create Leaflet map
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
	var Map = L.map("map", {
		center: [-37.81, 144.96],
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
            var div = L.DomUtil.create('div', 'legend');
            var depths = [0, 10, 30, 50, 70, 90];
            div.innerHTML += '<b>Depth (km)</b><br>';
            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<div class="legendcolour"><i style="background: ' + getcolour(depths[i]+1) + '"></i> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+') + '</div>';
            }
            return div;
        };
        colourlegend.addTo(Map);
    }

	// Create earthquake markers on map
	// Create for loop to cycle through data stations
	data.features.forEach(function(feature) {
		var lat = feature.geometry.coordinates[1];
		var lng = feature.geometry.coordinates[0];
		var depth = feature.geometry.coordinates[2];
		var mag = feature.properties.mag;
		var title = feature.properties.title;
		if (depth < 0){
			depth = 0;
		}
		var colourdepth = getcolour(depth);
		
		// Create marker and popup for the current data station
		L.circleMarker([lat, lng], {
			fillOpacity: 0.8,
			color: "lightgrey",
			fillColor: getcolour(depth),
			radius: mag * 5,
			weight: 1,
			opacity: 1
		}).bindPopup("<b>Earthquake Location: </b>" + lat + ", "+ lng +"<br> <b> Depth: </b>" + depth + "<br> <b> Magnitude: </b>" + mag)
		.addTo(Map);
	});
	
	// Call the createlegend function
	createlegend();
  });
  