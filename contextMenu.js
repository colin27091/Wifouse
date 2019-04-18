$(document).ready(function(){
    
    map.on('contextmenu', function(e) {
        
        var contextMenu = document.createElement("nav");
        contextMenu.id = "menu";
        contextMenu.className = "show";
        contextMenu.innerHTML = "<div id='context'>"
                                +   "<div onclick=openForm("+ JSON.stringify(e.lngLat) +")>Ajouter une Borne</div>"
                                +   "<div onclick=searchWithCoord("+ JSON.stringify(e.lngLat) +")>Recherche sur le clic</div>"
                                +"</div>";
        contextMenu.style.top =  event.pageY-document.getElementById("navigation").clientHeight + 'px';
        contextMenu.style.left = event.pageX + 'px';
        
        $("#map").append(contextMenu);
        
    });
    
    $(document).bind("click", function(event) {
        if(document.getElementById("menu") != null){
            document.getElementById("menu").remove();
        }
            
    });
    



});


function openForm(coord){
    console.log(coord);
}

function searchWithCoord(coord){

    get5near([coord.lat,coord.lng]);

}