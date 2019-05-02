$(document).ready(function(){
    
    
    openDB();// initDB -> loadJSON -> setData || chargeMap
    
    
    
    $("#choixgraph").change(function(event){
        chargeChart();
    });
    
    $("#checkboxdiv").change(function(){
        chargeChart();
    });
    
    $("#geolocalisation").click(function(){
        navigator.geolocation.getCurrentPosition(function(position){
            centerOnCoord([position.coords.longitude, position.coords.latitude]);
            get5near([position.coords.latitude, position.coords.longitude]);
        });
    });
    
    $('#transition').on('click', function(evt){
        evt.preventDefault(); 
        var target = $(this).attr('href');
        $('html, body') 
        .stop()
        .animate({scrollTop: $(target).offset().top}, 500 );
    });
    
    $("#reponse").click(function() {
        $("#results").toggle('fast',function() {
            $("#map").css('width', '107.1%');
            $("#carte").toggleClass('col');
            $("#carte").css("position","absolute");
            $("#carte").css("z-index","1");


        });
    });
    
    $("#research").keydown(function(event){
        if(event.keyCode == 13) {
            event.preventDefault();
            getCoordWithAddress(document.getElementById("research").value);
        }
    });
    
});  