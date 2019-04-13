$(document).ready(function(){

    openDB();// initDB -> loadJSON -> setData || chargeMap

    $("#geolocalisation").click(function(){
        navigator.geolocation.getCurrentPosition(function(position){
            centerOnCoordWithUserLocation([position.coords.longitude, position.coords.latitude]);
        });
        //centerOnCoord([42,1]);
    });

    $("reponse").click(function(){

    });

    

    map.on("contextmenu", function(e){//Right CLick
       console.log(JSON.stringify(e.lngLat));
    });





});