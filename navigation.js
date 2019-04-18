$(document).ready(function(){


    


});


function getCoord(adresse){

    $.getJSON('https://api-adresse.data.gouv.fr/search/?q='+adresse, function(data){
        console.log(data.features[0].geometry.coordinates);
    });


}