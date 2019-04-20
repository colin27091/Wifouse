mapboxgl.accessToken = 'pk.eyJ1IjoiZGE4ZTQwYjM2NCIsImEiOiJjanRmaXo4bHEwYmMyNGFydW5vdXIzNDZ5In0.uCRagyv40sEDNa78h4RWqg';

var navigation;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [1.4437, 43.6043], // Toulouse Data GPS
    zoom: 11
});

map.addControl(new mapboxgl.NavigationControl(),'top-right');

// Get mouse coordinates on click
map.on('click', function (e) {
    console.log(JSON.stringify(e.lngLat))
});

map.on('contextmenu', function(e) {
    var contextMenu = document.createElement("nav");
    contextMenu.id = "menu";
    contextMenu.className = "show";
    contextMenu.innerHTML = "<div id='context'>"
                            +   "<div onclick=openForm("+ JSON.stringify(e.lngLat) +")>Ajouter une Borne</div>"
                            +   "<div onclick=get5near("+ JSON.stringify([e.lngLat.lat,e.lngLat.lng]) +")>Recherche sur le clic</div>"
                            +"</div>";
    contextMenu.style.top =  event.pageY-document.getElementById("navigation").clientHeight + 'px';
    contextMenu.style.left = event.pageX-document.getElementById("results").clientWidth + 'px';
    
    $("#map").append(contextMenu);


    $("#menu").mouseleave(function(event) {
        if(document.getElementById("menu") != null){
            document.getElementById("menu").remove();
        }
            
    });

    $(document).bind('click', function(event) {
        if(document.getElementById("menu") != null){
            document.getElementById("menu").remove();
        }
            
    });
    
});

function centerOnId(id){

    var transaction = db.transaction("bornes");
    var store = transaction.objectStore("bornes");
    var request = store.get(id);
    
    request.onsuccess = function(event){
        

        var coord = request.result.geometry.coordinates;

        map.flyTo({center: coord, zoom:15});
        popup(request.result);
    };
    
    request.onerror = function(event){
        console.error("Request error");
    };


}

function popup(obj){

    var pop = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        anchor: 'bottom',
        
    })

    console.log(pop);

    var coord = obj.geometry.coordinates;
    
    var div = document.createElement('div');
    div.innerText = obj.fields.site;



    pop.setLngLat(coord);
    pop.setHTML(div.outerHTML);

    

    pop.addTo(map);
}

function centerOnCoord(coord){

    var el = document.createElement('div');
    
    el.setAttribute("id", "userLocation");
    el.className = 'marker';
    new mapboxgl.Marker(el) 
            .setLngLat(coord)
            .addTo(map);

    map.flyTo({center: coord, zoom:17});

}

function openForm(coord){
    console.log(coord);
}

function searchWithCoord(coord){

    getByIdTab([coord.lat,coord.lng]);

}


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



