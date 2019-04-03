

$(document).ready(function() {


    var data = loadJSON()//Recuperation des données du JSON file


})


async function loadJSON() {
    var response = await fetch("bornes-wi-fi.json")
    var str = await response.text()
    var data = JSON.parse(str)
    createIDB(data)
}


function createIDB(){
    var idb = window.indexedDB
    var request = idb.open("bornes")


    request.onerror = function(event){
        console.log("Erreur lors de l'initialisation de l'indexedDB")
    }

    request.onsuccess = function(event){
        console.log("IndexedDB bien initialisée")
    }

    request.onupgradeneeded = function(event){
        var db = event.target.result
        for(var obj in data){
            var objectStore = db.createObjectStore("bornes", { keyPath : "key"})
        }
        
    }
}
