$(document).ready(function(){


    $("#search").submit(function(){

        console.log("pas submit");
        return false;

    });


});


function getCoord(adresse){

    var geocoder = new MapboxGeocoder();

    geocoder.on('result', function(event){
        console.log(event.result.geometry);
    });

    geocoder.on = "Albi";

}