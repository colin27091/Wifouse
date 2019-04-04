
const file = "bornes-wi-fi.json";//Fichier Json
var idb;
var request;
var db;
var data;



loadJSON();//Import des records dans data



async function loadJSON() {
    var response = await fetch(file);
    var str = await response.text();

    data = JSON.parse(str);

    createIDB(data);

    
}


function createIDB(data){

    idb = window.indexedDB;
    request =  idb.open("DATA",3);


    request.onerror = function(event){
        console.error("Error IDB");
    };

    request.onsuccess = function(event){
        console.log("Success IDB");
        db = event.target.result;
    };

    request.onupgradeneeded = function(event){

        db = event.target.result;
        
        db.onerror = function(event){
            console.error("Database error");
        };

        objectStore = db.createObjectStore("Bornes", {autoIncrement: true});
        
        objectStore.transaction.oncomplete = function(event){
            transaction = db.transaction("Bornes", "readwrite").objectStore("Bornes");

            for(var i in data){
                transaction.add(data[i]);
            }
        };


    };

}

