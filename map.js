mapboxgl.accessToken = 'pk.eyJ1IjoiZGE4ZTQwYjM2NCIsImEiOiJjanRmaXo4bHEwYmMyNGFydW5vdXIzNDZ5In0.uCRagyv40sEDNa78h4RWqg';

var navigation;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
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


// Navigation controls (Zoom and scroll bar on top right)
map.addControl(new mapboxgl.NavigationControl(),'top-right');

// Get mouse coordinates on click
map.on('click', function (e) {
    console.log(JSON.stringify(e.lngLat))
});


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
    pop.setHTML("<button>"+obj.fields.adresse+"</button>");

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

function mouseX(evt) {
    if (evt.pageX) {
        return evt.pageX;
    } else if (evt.clientX) {
       return evt.clientX + (document.documentElement.scrollLeft ?
           document.documentElement.scrollLeft :
           document.body.scrollLeft);
    } else {
        return null;
    }
}

function mouseY(evt) {
if (evt.pageY) {
    return evt.pageY;
} else if (evt.clientY) {
    return evt.clientY + (document.documentElement.scrollTop ?
    document.documentElement.scrollTop :
    document.body.scrollTop);
} else {
    return null;
}
}