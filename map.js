mapboxgl.accessToken = 'pk.eyJ1IjoiZGE4ZTQwYjM2NCIsImEiOiJjanRmaXo4bHEwYmMyNGFydW5vdXIzNDZ5In0.uCRagyv40sEDNa78h4RWqg';

var navigation;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [1.4437, 43.6043], // Toulouse Data GPS
    zoom: 11
});

// var layerList = document.getElementById('menu');
// var inputs = layerList.getElementsByTagName('input');

// Switch the theme of the layers
// function switchLayer(layer) {
//     var layerId = layer.target.id;
//     map.setStyle('mapbox://styles/mapbox/' + layerId + '-v9');
// } 

// for (var i = 0; i < inputs.length; i++) {
//     inputs[i].onclick = switchLayer;
// }

// Label to Search Countries/Cities
// Var from for start 

map.on('load', function () {
 
    map.addLayer({
        "type": "FeatureCollection",
        "features":[
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates":[
                        1.436122221425398,
                        43.6032638910665
                    ]
                }
            }
        ]
    });
});





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