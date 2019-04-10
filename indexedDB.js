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

function chargeMap(){

    

}

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

