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
    div.setAttribute("id", "InfoBorne");
    div.style.height = '255px';
    div.style.width = '510px';

    //Ligne et Colonnes
    var row1 = document.createElement('div');
    row1.setAttribute("class" , "row inforow");

    var row2 = document.createElement('div');
    row2.setAttribute("class" , "row inforow");

    var row3 = document.createElement('div');
    row3.setAttribute("class" , "row butrow");

    var col1 = document.createElement('div');
    col1.setAttribute("class" , "col sm-1 infocoltop");

    var col2 = document.createElement('div');
    col2.setAttribute("class" , "col sm-1 infocol2");

    var col3 = document.createElement('div');
    col3.setAttribute("class" , "col sm-1  infocol3");

    var col4 = document.createElement('div');
    col4.setAttribute("class" , "col sm-1  infocol4");
    //fin de ligne et colonnes

    //nom de la connexion
    var nom = document.createElement('div');
    nom.setAttribute('id', 'Nnom');
    nom.innerText = "Nom de la connexion :  ";
    nom.style.width = '500px';
    nom.style.textAlign = 'center';
    nom.className = "textmodiflite";
    nom.setAttribute('for', 'label_nom');
    nom.style.marginTop = "3px";
    var lnom = document.createElement('div');
    lnom.setAttribute('id', 'label_nom');
    lnom.innerText = obj.fields.nom_connexion;
    lnom.className = "textmodif";
    lnom.style.width = '500px';
    lnom.style.textAlign = 'center';

    col1.append(nom, lnom);
    row1.append(col1);
    //fin nom de la connexion

    //Nom du quartier(site)
    var site = document.createElement('div');
    site.setAttribute('id', 'Nsite');
    site.innerText = "Adresse : ";
    site.setAttribute('for', 'label_site');
    site.className = "textmodiflite";
    site.style.marginTop = "3px";
    var lsite = document.createElement('label');
    lsite.setAttribute('id', 'label_site');
    lsite.innerText = obj.fields.site;
    lsite.className = "textmodif";

    col3.append(site,lsite);
    //fin 


    //année
    var annee = document.createElement('div');
    annee.setAttribute('id', 'Nannee');
    annee.innerText = "Installé en :" ;
    annee.setAttribute('for', 'label_annee');
    annee.className = "textmodiflite";
    annee.style.marginTop = "3px";

    var lannee = document.createElement('div');
    lannee.setAttribute('id', 'label_annee');
    lannee.className = "form-group";
    lannee.className = "textmodif";
    lannee.innerText = obj.fields.annee_installation;

    col2.append(annee,lannee);
    //fin année

    //dispo
    var dispo = document.createElement('div');
    dispo.setAttribute('id', 'Ndispo');
    dispo.innerText = "Disponibilité :";
    dispo.className = "textmodiflite";
    dispo.setAttribute('for', 'input_dispo');
    dispo.style.marginTop = "3px";

    var ldispo = document.createElement('div');
    ldispo.setAttribute('id', 'label_dispo');
    ldispo.className = "textmodif";
    ldispo.style.width = '270px';
    ldispo.innerText = obj.fields.disponibilite;


    col2.append(dispo,ldispo);
    //fin dispo

    

    //zone d'emission 
    var zone = document.createElement('div');
    zone.setAttribute('id', 'Nzone');
    zone.innerText = "Zone d'émission : ";
    zone.className = "textmodiflite";
    zone.setAttribute('for', 'input_zone');
    zone.style.marginTop = "19px";

    var lzone = document.createElement('div');
    lzone.setAttribute('id', 'label_zone');
    lzone.innerText = obj.fields.zone_emission;
    lzone.className = "textmodif";

    
    col3.append(zone,lzone);
    //fin zone d'emission

    //button
    var modify = document.createElement('button');
    var remove = document.createElement('button');

    remove.setAttribute("class", "btn btn-outline-danger btn-sm");
    remove.setAttribute("id", "butform");
    remove.setAttribute('onclick', 'removeTerminal()');
    remove.style.float = 'right';
    remove.innerText = "Supprimer";
    

    modify.setAttribute("class", "btn btn-outline-warning btn-sm");
    modify.setAttribute("id", "butform");
    modify.setAttribute('onclick', 'removeTerminal()');
    modify.style.float = 'right';
    modify.innerText = "Modifier";
    //fin button

    if(obj.ID <= 84){
        remove.disabled = true;
        modify.disabled = true;
    }
    col4.append(remove, modify)
    row3.append(col4);
    row2.append(col2, col3);
    div.append(row1);
    div.append(row2);
    div.append(row3);

    
    
    pop.setLngLat(coord);
    pop.setHTML(div.outerHTML);
    pop.addTo(map);
}

function centerOnCoord(coord){
    
    $("#location").remove();
    var el = document.createElement('div');
    
    el.setAttribute("id", "location");
    el.className = 'marker';
    var locate = new mapboxgl.Marker(el);

    locate.setLngLat(coord)
    locate.addTo(map);
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
            'fill-opacity': 0.3,
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

    //Ligne et Colonnes
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
    //fin de ligne et colonnes

    //nom de la connexion
    var nom = document.createElement('label');
    nom.setAttribute('id', 'Nnom');
    nom.innerText = "Nom de la connexion :  ";
    nom.setAttribute('for', 'input_nom');
    nom.style.float = 'left';
    nom.style.marginTop = "3px";

    var lnom = document.createElement('input');
    lnom.setAttribute('id', 'input_nom');
    lnom.className = "form-control";

    col1.append(nom, lnom);
    row1.append(col1);
    //fin nom de la connexion

    //Nom du quartier(site)
    var site = document.createElement('label');
    site.setAttribute('id', 'Nsite');
    site.innerText = "Adresse : ";
    site.setAttribute('for', 'input_site');
    site.style.float = 'left';
    site.style.marginTop = "3px";

    var lsite = document.createElement('input');
    lsite.setAttribute('id', 'input_site');
    lsite.className = "form-control";

    col3.append(site,lsite);
    //fin 


    //année
    var annee = document.createElement('label');
    annee.setAttribute('id', 'Nannee');
    annee.innerText = "Installé en :" ;
    annee.setAttribute('for', 'input_annee');
    annee.style.float = 'left';
    annee.style.marginTop = "3px";

    var lannee = document.createElement('div');
    lannee.setAttribute('id', 'input_annee');
    lannee.className = "form-group";
    var annee_form = "<select id='input_annee_form' class='form-control'>";
    annee_form += "<option selected>2019</option>";
    for(var i = 2018; i > 2000; i --){
        annee_form += "<option>"+ i +"</option>";
    }
    annee_form += "</select>";
    lannee.innerHTML = annee_form;

    col2.append(annee,lannee);
    //fin année

    //dispo
    var dispo = document.createElement('label');
    dispo.setAttribute('id', 'Ndispo');
    dispo.innerText = "Disponibilité :";
    dispo.setAttribute('for', 'input_dispo');
    dispo.style.float = 'left';
    dispo.style.marginTop = "3px";

    var ldispo = document.createElement('input');
    ldispo.setAttribute('id', 'input_dispo');
    ldispo.setAttribute('aria-describedby', 'Help');
    ldispo.className = "form-control";

    var ldispohelp = document.createElement('small');
    ldispohelp.id = 'Help';
    ldispohelp.className = "form-text text-muted";
    ldispohelp.innerText = "ex:24/24h(avec garantie de service)";
    ldispohelp.style.float = 'left';

    col2.append(dispo,ldispo, ldispohelp);
    //fin dispo

    

    //zone d'emission 
    var zone = document.createElement('label');
    zone.setAttribute('id', 'Nzone');
    zone.innerText = "Zone d'émission : ";
    zone.setAttribute('for', 'input_zone');
    zone.style.float = 'left';
    zone.style.marginTop = "19px";

    var lzone = document.createElement('div');
    lzone.setAttribute('id', 'input_zone');
    lzone.className = "form-group col zonemargin";
    lzone.innerHTML ="<select id='input_zone_form' class='form-control'>"
                    +"<option selected>Intérieur</option>"
                    + "<option>Extérieur</option>"
                    +"</select>";
    
    col3.append(zone,lzone);
    //fin zone d'emission

    //button
    var save = document.createElement('button');
    var cancel = document.createElement('button');

    cancel.setAttribute("class", "btn btn-outline-danger btn-sm");
    cancel.setAttribute("id", "butform");
    cancel.setAttribute('onclick', 'removeTerminal()');
    cancel.style.float = 'right';
    cancel.innerText = "Annuler";

    save.setAttribute("class", "btn btn-outline-success btn-sm");
    save.setAttribute("id", "butform");
    save.setAttribute('onclick', 'removeTerminal()');
    save.style.float = 'right';
    save.innerText = "Sauvegarder";
    //fin button

    
    
    row2.append(col2, col3);
    div.append(row1);
    div.append(row2);
    div.append(cancel,save);
    

    pop.setLngLat(coord);
    pop.setHTML(div.outerHTML);

    return pop;
}




