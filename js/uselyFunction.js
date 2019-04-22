function isInside(point, quartier){

    var x = point[0],
    y = point[1];

    var inside = false;

    for(var i = 0, j = quartier.length - 1; i < quartier.length; j = i++){
        var xi = quartier[i][0], yi = quartier[i][1];
        var xj = quartier[j][0], yj = quartier[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside
}

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

function distCalcul(tab, coord){

    var top5 = [];
    var result = [];

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
    return result;
}

function getCoordWithAddress(adresse){

    $.getJSON('https://api-adresse.data.gouv.fr/search/?q='+adresse, function(data){
        return data.features[0].geometry.coordinates;
    });


}
