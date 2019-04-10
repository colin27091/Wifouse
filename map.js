mapboxgl.accessToken = 'pk.eyJ1IjoiZGE4ZTQwYjM2NCIsImEiOiJjanRmaXo4bHEwYmMyNGFydW5vdXIzNDZ5In0.uCRagyv40sEDNa78h4RWqg';

var navigation;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [1.4437, 43.6043], // Toulouse Data GPS
    zoom: 11
});

// Switch the theme of the layers
function switchLayer(layer) {
    var layerId = layer.target.id;
    map.setStyle('mapbox://styles/mapbox/' + layerId + '-v9');
} 

for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}





var recherche = map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    
    // Limit results to country
    countries: 'fr',
    
    filter: function (item) {
        
        return item.context.map(function (i) {
            
            return i.text;
        }).reduce(function (acc, cur) {
            return acc || cur;
        });
        
    }
    
}),'top-right');

// Add geolocate control to the map.
// User location
var userlocation = map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}),'bottom-right');

// Navigation controls (Zoom and scroll bar on top right)

map.addControl(new mapboxgl.NavigationControl(),'top-right');

// Get mouse coordinates on click
map.on('click', function (e) {
    console.log(JSON.stringify(e.lngLat))
    });

    var radius = 20;
 
    function pointOnCircle(angle) {
    return {
    "type": "Point",
    "coordinates": [
    Math.cos(angle) * radius,
    Math.sin(angle) * radius
    ]
    };
    }
     
    map.on('load', function () {
    // Add a source and layer displaying a point which will be animated in a circle.
    map.addSource('point', {
    "type": "geojson",
    "data": pointOnCircle(0)
    });
     
    map.addLayer({
    "id": "point",
    "source": "point",
    "type": "circle",
    "paint": {
    "circle-radius": 10,
    "circle-color": "#007cbf"
    }
    });
     
    function animateMarker(timestamp) {
    // Update the data to a new position based on the animation timestamp. The
    // divisor in the expression `timestamp / 1000` controls the animation speed.
    map.getSource('point').setData(pointOnCircle(timestamp / 1000));
     
    // Request the next frame of the animation.
    requestAnimationFrame(animateMarker);
    }
     
    // Start the animation.
    animateMarker(0);
    });