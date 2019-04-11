
var a = 43.6032638910665//Latitude Lieu 1
var b = 1.436122221425398//Longitude Lieu 1
var c = 43.601713891336836//Latitude Lieu 2
var d = 1.43968888692553//Longitude Lieu 2

var e=(3.14159265358979*a/180); 
var f=(3.14159265358979*b/180); 
var g=(3.14159265358979*c/180);
var h=(3.14159265358979*d/180);
var i=(Math.cos(e)*Math.cos(g)*Math.cos(f)*Math.cos(h)+Math.cos(e)*Math.sin(f)*Math.cos(g)*Math.sin(h)+Math.sin(e)*Math.sin(g)); 
var j=(Math.acos(i));
var k=Math.round(6371*j*10)/10;

console.log(k);

function dist(tab1, tab2){
    var a = tab1[0];
    var b = tab1[1];
    var c = tab2[0];
    var d = tab2[1];

    var e=(3.14159265358979*a/180); 
    var f=(3.14159265358979*b/180); 
    var g=(3.14159265358979*c/180);
    var h=(3.14159265358979*d/180);

    var i=(Math.cos(e)*Math.cos(g)*Math.cos(f)*Math.cos(h)+Math.cos(e)*Math.sin(f)*Math.cos(g)*Math.sin(h)+Math.sin(e)*Math.sin(g)); 
    var j=(Math.acos(i));
    var k=Math.round(6371*j*10)/10;

    return k;


}



function get5near(coord){

    var top5 = [];
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

        tab.forEach(function(item) {
            console.log(dist(item,coord).valueOf());
            top5.push(dist(item,coord).valueOf());

        })

        console.log(top5);

    };


}


console.log($("#search").val());
    $("#search").val('');