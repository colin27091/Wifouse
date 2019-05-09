mapboxgl.accessToken = 'pk.eyJ1IjoiZGE4ZTQwYjM2NCIsImEiOiJjanRmaXo4bHEwYmMyNGFydW5vdXIzNDZ5In0.uCRagyv40sEDNa78h4RWqg';

var navigation;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [1.4437, 43.6043], // Toulouse Data GPS
    zoom: 11
});

// Navigation controls (Zoom and scroll bar on top right)
map.addControl(new mapboxgl.NavigationControl(),'top-right');

// View the map on fullscreen
map.addControl(new mapboxgl.FullscreenControl(),'bottom-right');

map.on('contextmenu', function(e) {
    var contextMenu = document.createElement("nav");
    contextMenu.id = "menu";
    contextMenu.className = "show";
    contextMenu.innerHTML = "<div id='context' style='height:50px; box-shadow:2px 5px 2em #aaa; width: 150px;'>"
    +   "<div id='ajout' style='margin-left:2px; font-size:14px; font-style:italic; font-family:Hind,sans-serif; padding-top:2px; margin: 2px 2px;' onclick=addTerminal("+ JSON.stringify([e.lngLat.lng, e.lngLat.lat]) +")>Ajouter une Borne</div>"
    +   "<div id='clic' style=' margin-left:2px; font-size:14px;font-style:italic; font-family:Hind, sans-serif;  padding-bottom:3px;' onclick=get5near("+ JSON.stringify([e.lngLat.lat,e.lngLat.lng]) +")>Recherche sur le clic</div>"
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
        className: 'popups',
        closeButton: false,
        closeOnClick: true,
        anchor: 'bottom'
    })


    $(window).bind('click', function(event){
        pop.remove();
    })

    var coord = obj.geometry.coordinates;

    var div = document.createElement('div');
    div.setAttribute("id", "popupborne");

    var site = document.createElement('div');
    site.setAttribute('id', 'site');
    site.setAttribute('class', 'popuptext');

    var annee = document.createElement('div');
    annee.setAttribute('id', 'annee');
    annee.setAttribute('class', 'popuptext');

    var dispo = document.createElement('div');
    dispo.setAttribute('id', 'dispo');
    dispo.setAttribute('class', 'popuptext');

    var nom = document.createElement('div');
    nom.setAttribute('id', 'nom');
    nom.setAttribute('class', 'popuptext');

    var zone = document.createElement('div');
    zone.setAttribute('id', 'zone');



    site.innerText = obj.fields.site;
    annee.innerText = "Installé en " +obj.fields.annee_installation;
    dispo.innerText = "Disponible "+obj.fields.disponibilite;
    nom.innerText = "Nom de connexion:  "+obj.fields.nom_connexion;
    zone.innerText = "Zone d'émission: "+ obj.fields.zone_emission;


    div.append(site);
    div.append(annee);
    div.append(dispo);
    div.append(nom);
    div.append(zone);
    
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

function searchWithCoord(coord){

    getByIdTab([coord.lat,coord.lng]);

}

function addQuartier(obj){

    map.addLayer({
        'id' : obj.fields.libelle_des_grands_quartiers,
        'type' : 'fill',
        'source' : {
            'type' : 'geojson',
            'data' : {
                'type': 'Feature',
                "properties" : {
                    'name' : obj.fields.libelle_des_grands_quartiers
                },
                
                'geometry' : obj.fields.geo_shape
            }
                
        },
        'layout' : {
        },
        'paint' : {
            'fill-color': '#AFAFAF',
            'fill-opacity': 0.2,
            'fill-outline-color' : '#000000'
        }
    });

    map.addLayer({
        "id": obj.fields.libelle_des_grands_quartiers+'_name',
        "type": "symbol",
        "source":{
            'type' : 'geojson',
            'data' : {
                'type': 'Feature',
                "properties" : {
                    'name' : obj.fields.libelle_des_grands_quartiers
                },
            
                'geometry' : obj.geometry
            } 
        },
        "layout": {
            "text-font": ["Open Sans Regular"],
            "text-field": obj.fields.libelle_des_grands_quartiers,
            "text-size": 12
        },
        "paint": {}
    });
}
        




function addMarker(obj){

    var el = document.createElement('div');
    el.setAttribute("id", obj.ID);
    el.className = 'marker';

    el.onclick = function(event){

        var id = parseInt(event.target.id);
        console.log(id);
        centerOnId(id);
    };

    var mark = new mapboxgl.Marker(el)
    .setLngLat(obj.geometry.coordinates)
    .addTo(map);

}


function addTerminal(coord){

    var el = document.createElement('div');
    el.setAttribute("id", "drag");
    el.className = 'draggable';

    var drag  = new mapboxgl.Marker(el)
    .setDraggable(true)
    .setLngLat(coord)
    .addTo(map);

    el.onclick = function(event){

        var drag_lnglat = drag.getLngLat();
        map.flyTo({center: drag_lnglat, zoom:15});
        drag.setDraggable(false);
        drag.setPopup(openForm([drag_lnglat.lng, drag_lnglat.lat]));
    }
}
// Method to add a draggable marker

function openForm(coord){

    // console.log("coord", coord);
    
    var pop = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        anchor: 'bottom',
    })


    

    var div = document.createElement('div');
    div.setAttribute("id", "Nouvelleborne");

    var row1 = document.createElement('div');
    row1.setAttribute("class" , "row");

    var row2 = document.createElement('div');
    row2.setAttribute("class" , "row");

    var col1 = document.createElement('div');
    col1.setAttribute("class" , "col");

    var col2 = document.createElement('div');
    col2.setAttribute("class" , "col sm-1");

    var col3 = document.createElement('div');
    col3.setAttribute("class" , "col sm-1");

    var site = document.createElement('div');
    site.setAttribute('id', 'Nsite');

    var lsite = document.createElement('div');
    site.setAttribute('id', 'Lsite');

    var annee = document.createElement('div');
    annee.setAttribute('id', 'Nannee');
    var lannee = document.createElement('div');
    annee.setAttribute('id', 'Lannee');

    var dispo = document.createElement('div');
    dispo.setAttribute('id', 'Ndispo');
    var ldispo = document.createElement('div');
    dispo.setAttribute('id', 'Ldispo');

    var nom = document.createElement('div');
    nom.setAttribute('id', 'Nnom');
    var lnom = document.createElement('div');
    nom.setAttribute('id', 'Lnom');

    var zone = document.createElement('div');
    zone.setAttribute('id', 'Nzone');
    var lzone = document.createElement('div');
    zone.setAttribute('id', 'Lzone');


    site.innerText = "Adresse :"
    lsite.innerHTML = "<input>"+"</input>"


    annee.innerText = "Installé en :" ;
    lannee.innerHTML = "<input>"+"</input>"
    
    
    dispo.innerText = "Disponibilité :";
    ldispo.innerHTML = "<input>"+"</input>"
    
    
    nom.innerText = "Nom de la connexion :  ";
    lnom.innerHTML = "<input>"+"</input>"
    
    
    zone.innerText = "Zone d'émission : ";
    lzone.innerHTML = "<div id ='trigraph' class='form-group col-md-1'>" + "</div>" + "<select id='inputSort' class='form-control'>"+" <option>" +"Intérieur"+" </option>"+ "<option>"+"Extérieur"+"</option>"+"</select>"

    
    var but = document.createElement('button');
    var but2 = document.createElement('button');

    but.setAttribute("class", "btn btn-outline-success btn-sm");
    but.setAttribute("id", "butform");
    but.setAttribute("onclick", "removeTerminal("+"),");


    but2.setAttribute("class", "btn btn-outline-danger btn-sm");
    but2.setAttribute("id", "butform");
    but2.setAttribute("onclick", "removeTerminal("+"),");

    but.innerText = "Sauvegarder"
    but2.innerText = "Annuler"

    col1.append(site,lsite);
    row1.append(col1);
    col2.append(annee,lannee);
    col2.append(dispo,ldispo);
    col3.append(nom,lnom);
    col3.append(zone,lzone);
    row2.append(col2, col3);
    div.append(row1);
    div.append(row2);
    div.append(but,but2);
    

    pop.setLngLat(coord);
    pop.setHTML(div.outerHTML);

    return pop;
}


// function onDragEnd() {
//     var lngLat = markerdrag.getLngLat();
//     console.log(JSON.stringify(lngLat));
// }

// markerdrag.on('dragend', function(event){
//     console.log(event);
// });

// var marqueur = document.getElementById("ajout-borne");



// function AjoutBorne() {
//     markerdrag.addTo(map)
//     var coordon = markerdrag.getLngLat();
//     map.flyTo({center: coordon, zoom:13});
// }

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






