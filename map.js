mapboxgl.accessToken = 'pk.eyJ1IjoiZGE4ZTQwYjM2NCIsImEiOiJjanRmaXo4bHEwYmMyNGFydW5vdXIzNDZ5In0.uCRagyv40sEDNa78h4RWqg';

var navigation;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [1.4437, 43.6043], // Toulouse Data GPS
    zoom: 11
});


// ------------LAISSEZ CA EN COMMENTAIRE ON EN A PAS BESOIN POUR LE MOMENT---------
// ---------CA CORRESPOND AU CHANGEMENT DE STYLE DE LA MAP DONC PAS PRIORITAIRE POUR LE MOMENT------

// Switch the theme of the layers
// function switchLayer(layer) {
//     var layerId = layer.target.id;
//     map.setStyle('mapbox://styles/mapbox/' + layerId + '-v9');
// } 

// for (var i = 0; i < inputs.length; i++) {
//     inputs[i].onclick = switchLayer;
// }





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
var circleRadius = 45;


function centerOnId(id){

    var transaction = db.transaction("bornes");
    var store = transaction.objectStore("bornes");
    var request = store.get(id);
    
    request.onsuccess = function(event){
        

        var coord = request.result.geometry.coordinates;

        map.flyTo({center: coord, zoom:17});
        popup(request.result);
    };
    
    request.onerror = function(event){
        console.error("Request error");
    };


}

function popup(obj){

    var pop = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        anchor: 'bottom',
        
    })

    var coord = obj.geometry.coordinates;

    pop.setLngLat(coord);
    pop.setHTML('<form>'+
    '<div class="form-group">'+
         '<label for="nom-connexion">Nom de la connexion</label>'+
         '<input type="email" class="form-control" id="nom-connexion" >'+
     '</div>'+
     '<div class="form-group">'+
         '<label for="commune">Commune</label>'+
         '<input type="text" class="form-control" id="commune" >'+
     '</div>'+
     '<div class="form-group">'+
         '<label for="adresse">Adresse</label>'+
         '<input type="text" class="form-control" id="adresse" >'+
     '</div>'+
     '<div class="form-group">'+
             '<label for="site">Site</label>'+
             '<input type="text" class="form-control" id="site" >'+
    '</div>'+
     '<div class="form-group">'+
         '<button type="submit" class="btn btn-primary">Sauvegarder</button>'+
         '<button type="submit" class="btn btn-secondary">Modifier</button>'+
         '<button type="submit" class="btn btn-danger">Annuler</button>'+
     '</div>'+   
 '</form>');

    pop.addTo(map);

}

function centerOnCoordWithUserLocation(coord){

    var el = document.createElement('div');
    
    el.setAttribute("id", "userLocation");
    el.className = 'marker';
    new mapboxgl.Marker(el) 
            .setLngLat(coord)
            .addTo(map);

    map.flyTo({center: coord, zoom:17});

}