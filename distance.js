
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

    var result = [];
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
            top5.push(dist(coord, item));
        })

        for (i = 0; i < 5; i++) {
            var min  = null;
            var ind = null;
            top5.forEach(function(item, index){
                if((min > item || min == null) && item != null){
                    min = item;
                    ind = index;
                }
            })
            top5[ind] = null;
            result.push(ind + 1);
        }

        getWithTab(result);

    };


}

console.log($("#search").val());
    $("#search").val('');