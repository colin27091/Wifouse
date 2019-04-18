var db;
var storeName = "bornes";
var storePop = "population";
var file_terminal = "bornes-wi-fi.json";
var file_population = "population_Toulouse.json";
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
    if (!db.objectStoreNames.contains(storeName)) {
        
        db.createObjectStore(storeName, { keyPath: "ID", autoIncrement: true });
        loadJSON(file_terminal, storeName);
    }
    if (!db.objectStoreNames.contains(storePop)) {
        
        db.createObjectStore(storePop, { keyPath: "ID", autoIncrement: true });
        loadJSON(file_population, storePop);
    }


}

async function loadJSON(file, store){//Fonction asynchrone
    
    var response = await fetch(file);//Lecture du fichier
    var str = await response.text();
    
    var data = JSON.parse(str);//JSON to Array
    
    setData(data, store);
}

function setData(data, store) {
    
    const transaction = db.transaction(store, "readwrite");
    const objectStore = transaction.objectStore(store);
    
    for(var i in data){
        objectStore.put(data[i]);
    }
    
    transaction.oncomplete = function(event){
        console.log("Add data success");
        chargeMap();
    };
    
    transaction.onabort = function(event){
        console.error("Add data error");
    };
}


function addTerminal1(terminal){
    
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
        result = null;
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

function chargeMap(){

    var transaction = db.transaction(storeName, 'readonly');
    var store = transaction.objectStore(storeName);
    var request = store.getAll();
    
    request.onsuccess = function(event){
        
        request.result.forEach(function(marker){

            var el = document.createElement('div');
            el.setAttribute("id", marker.ID);
            el.className = 'marker';

            el.onclick = function(event){

                var id = parseInt(event.target.id);
                centerOnId(id);
            };

            new mapboxgl.Marker(el) 
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);
        })
        
        
    };
    
    request.onerror = function(event){
        console.error("Request error");
    };

    
}

function getByIdTab(tab){

    var result = [];
    var transaction = db.transaction("bornes");
    var store = transaction.objectStore("bornes");

    tab.forEach(function(item){
        var request = store.get(item);

        request.onsuccess = function(event){

        result.push(request.result);

        };
    })

    transaction.oncomplete = function(event){

        console.log(result);

    };


}

function get5near(coord){

    var tab = [];

    var transaction = db.transaction("bornes");
    var store = transaction.objectStore("bornes");
    var request = store.openCursor();

    request.onsuccess = function(event){

        var cursor = request.result;
        if(cursor){
            tab.push(cursor.value.fields.geo_point_2d);
            cursor.continue(); 
        } 
    };

    request.onerror = function(event){
        console.error("Request error");  
    };
    
    transaction.oncomplete = function(event){
        var result = distCalcul(tab, coord);
        getByIdTab(result);
    };
}
