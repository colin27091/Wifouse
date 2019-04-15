$(document).ready(function(){

    openDB();// initDB -> loadJSON -> setData || chargeMap

    $("#geolocalisation").click(function(){
        navigator.geolocation.getCurrentPosition(function(position){
            centerOnCoordWithUserLocation([position.coords.longitude, position.coords.latitude]);
        });
    });

    $("reponse").click(function(){
    });

});  
        

