var db;
var storeName = "bornes";
var file = "bornes-wi-fi.json";
var result;

function openDB(){//Ouverture Base
    var request = window.indexedDB.open("DATA");
    
    request.onsuccess = function(event){
        db = event.target.result;
        console.log("Database success");
        chargeMap();
    };
    
    request.onerror = function(event){
        console.error("Database error");
    };
    
    request.onupgradeneeded = function(event){
        db = event.target.result;
        console.log("Initialisation DB");
        initDB();
    };
}

function initDB() {//Création Store
    if (!db.objectStoreNames.contains("bornes")) {
        
        const store = db.createObjectStore(storeName, { keyPath: "ID", autoIncrement: true });
        store.createIndex("recordid", "recordid", { unique: true });
        store.createIndex("adresse", "fields.adresse", { unique: false });
        loadJSON();
    }
}

async function loadJSON(){//Fonction asynchrone
    
    var response = await fetch(file);//Lecture du fichier
    var str = await response.text();
    
    var data = JSON.parse(str);//JSON to Array
    
    setData(data);
}

function setData(data) {
    
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    
    for(var i in data){
        store.put(data[i]);
    }
    
    transaction.oncomplete = function(event){
        console.log("Add data success");
    };
    
    transaction.onabort = function(event){
        console.error("Add data error");
    };
}

function addTerminal(terminal){
    
    var transaction = db.transaction("bornes", "readwrite");
    var store = transaction.objectStore("bornes");
    var request = store.add(terminal);
    
    request.onsuccess = function(event){
        console.log("Terminal added");
    };
    
    request.onerror = function(event){
        console.log("Terminal not added");
    };
    
    
    
}

function removeTerminal(id){
    
    var transaction = db.transaction("bornes", "readwrite");
    var store = transaction.objectStore("bornes");
    
    if(id > 84){
        
        var request = store.delete(id);
        
        request.onsuccess = function(event){
            console.log("Terminal removed");
        }
        
        request.onerror = function(event){
            console.error("Terminal not removed");
        }
        
    } else {
        console.error("Remove not allow");
    }
    
    
}

function getValue(key){//Change result value
    
    
    var transaction = db.transaction("bornes");
    var store = transaction.objectStore("bornes");
    var request = store.get(key);
    
    request.onsuccess = function(event){
        console.log("Request success : ", request.result);
        result = request.result;
    };
    
    request.onerror = function(event){
        console.error("Request error");
    }; 
    
}

function getWithAddress(ad){//Change result value
    
    var transaction = db.transaction("bornes");
    var store = transaction.objectStore("bornes");
    var request = store.openCursor();
    
    result = [];
    
    request.onsuccess = function(event){
        
        var cursor = request.result;
        
        if(cursor){
            
            var adresse = cursor.value.fields.adresse;
            if(ad == adresse){
                result.push(cursor.value);
            }
            
            cursor.continue();
        }
        
    };
    
    request.onerror = function(event){
        console.error("Request error");
    };
    
    
}

function getAll(){//Change result value
    
    var transaction = db.transaction("bornes");
    var store = transaction.objectStore("bornes");
    var request = store.getAll();
    
    result = null;
    
    request.onsuccess = function(event){
        
        result = request.result;
        
    };
    
    request.onerror = function(event){
        console.error("Request error");
    };
    
    
}

function getCoordPoint(){//Change result value __ to fix 
    
    var transaction = db.transaction("bornes");
    var store = transaction.objectStore("bornes");
    var request = store.openCursor();
    
    result = [];
    
    request.onsuccess = function(event){
        
        var cursor = request.result;
        
        if(cursor){
            
            result.push(cursor.value.fields.geo_point_2d);
            cursor.continue();
            
        }
    };
    
    request.onerror = function(event){
        console.error("Request error");
    };
    
}

// J'AI MIS LA FONCTION EN COMMENTAIRE CAR IL FAUT REMPLACER GEOJSON PAR LES COORDONNEES GPS
// JE TE METS LE LIEN ICI POUR QUE TU COMPRENNE, MAIS VOILA CETTE METHODE AJOUTE UN MARKER DEPUIS LA BDD
//https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/
// LES METHODES POUR AJOUTER UN MARKER MANUELLEMENT JE LES METS JEUDI EN COURS COMME CA TU VOIS CE QUE CA DONNE ET TU ME DIS SI C'EST CA OU PAS

// function chargeMap(){
    
//     // add markers to map
//     geojson.features.forEach(function(marker) {
        
//         // create a HTML element for each feature
//         var el = document.createElement('div');
//         el.className = 'marker';
        
//         // make a marker for each feature and add to the map
//         new mapboxgl.Marker(el)
//         .setLngLat(marker.geometry.coordinates)
//         .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
//         .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
//         .addTo(map);
        
//     }); 
    
// }

function IndexedDBToJSON(){//To fix - Write in file
    
    var obj = [];
    
    var transaction = db.transaction("bornes");
    var store = transaction.objectStore("bornes");
    var request = store.openCursor();
    
    request.onsuccess = function(event){
        
        var cursor = request.result;
        
        if(cursor){
            
            obj.push(cursor.value);
            
            cursor.continue();
        }
        
    };
    
    transaction.oncomplete = function(event){
        
        var file = new File(["bornes_test"], "bornes_test.json", {
            type: "text/json",
        });
        file.open("w");
        file.writeln(JSON.stringify(obj));
        file.close();
        
    };
    
}

