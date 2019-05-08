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

    for (i = 0; i < 10; i++) {
        var min  = null;
        var ind = null;
        top5.forEach(function(item, index){
            if((min > item || min == null) && item != null){
                min = item;
                ind = index;
            }
        })
        result.push([ind + 1, top5[ind]]);
        top5[ind] = null;
        
    }
    return result;
}

function getCoordWithAddress(adresse){

    $.getJSON('https://api-adresse.data.gouv.fr/search/?q='+adresse, function(data){

        var coord = data.features[0].geometry.coordinates;
        map.flyTo({center: coord, zoom:14});
        document.getElementById('research').value = data.features[0].properties.label;

        get5near([coord[1], coord[0]]);


    });



}

function listQuartier(){

    var checkbox = document.getElementById("checkbox");
    checkbox.innerHTML = "";

    var tab = JSON.parse(localStorage.getItem("DistrictTab"));

    tab.forEach(function(item){

        var div = document.createElement('div');

        var input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "checkbox";
        input.id = item.name;
        input.value = item.name;
        input.checked = true;

        div.append(input);

        var label = document.createElement("label");
        label.id = "checktext";
        label.className = "form-check-label";
        label.setAttribute("for", item.name);
        label.innerText = item.name;

        div.append(label);

        checkbox.append(div);

    });
}


function getGraphForm(){

    var type = document.getElementById("inputState").value;
    var newType;

    switch(type){
        case "Lignes":
            newType = "line";
            break;
        case "Colonnes":
            newType = "bar";
            break;
        case "Nuage de points":
            newType = "bubble";
            break;
        case "Radar":
            newType = "radar";
            break;
        case "Polaire":
            newType = "polarArea";
            break;
        case "Donuts":
            newType = "doughnut";
            break;
            
    }
    return newType;
}

function getQuartierChecked(){
    var res = [];

    var el = document.getElementById("checkbox");

    var tab = el.getElementsByTagName('INPUT');

    for(var i = 0; i < tab.length; ++i){
        var quartier = tab[i];
        if(quartier.checked) {
            res.push(quartier.value.toUpperCase());
        }
    }
    return res;
}

function disctrictToChart(quartier_checked){//Verifie les quartier qui ont été coché
    
    var res = [];

    var tab = JSON.parse(localStorage.getItem("DistrictTab"));
    var dis = [];
    var nbBorne =[];
    tab.forEach(function(item){
        if(quartier_checked.includes(item.name)){
            dis.push(item.name);
            nbBorne.push(item.nbborne);  
        }
        
    })
    res.push(dis);
    res.push(nbBorne);

    return res;
}

function chargeChart() {

    Chart.defaults.global.title.display = true;
    Chart.defaults.global.title.text = "Répartition des bornes Wi-Fi par quartier";

    var chart_pattern ={
        type: 'line', // bar , radar , polarArea, buble , doughnut

        data: {
            labels: [],
            datasets: [{
                label: '',
                backgroundColor: '#42AA4D',
                borderColor: '42AA4D',
                data: []
            }]
        },

    	// Configuration options go here
        options: {

        }
    };

    var ctx = document.getElementById("Charts").getContext("2d");
    // Remove the old chart and all its event handles


    document.getElementById("Les_graphs").innerHTML = "<canvas id='Charts'></canvas>";

    var ctx = document.getElementById("Charts").getContext("2d");

    // Chart.js modifies the object you pass in. Pass a copy of the object so we can use the original object later
    var temp = jQuery.extend(true, {}, chart_pattern);

    var type = getGraphForm();

    temp.type = type;

    if(type == "polarArea"){
        
    }

    var quartier_checked = getQuartierChecked();

    var label_data = disctrictToChart(quartier_checked);

    temp.data.labels = label_data[0]//Label
    temp.data.datasets[0].data = label_data[1]//Data
    chart = new Chart(ctx, temp);
};

function showInResult(tab){


    var results = document.getElementById("results");
    results.innerHTML ="";
    results.style.width = "250px";
    tab.forEach(function(item){
        var it = document.createElement('div');
        if(item[0].ID <= 84){
            it.id = "not_mine";
        } else {
            it.id = "mine";
        }

        var name = document.createElement('h');
        name.innerText = item[0].fields.site + " "+ item[1]+"km";
        it.append(name);
        results.append(it);
        it.onclick = function(event){
            centerOnId(item[0].ID);
        }

    })

}

function removeResults(){

}

function openNav() {

    document.getElementById("results").style.width = "250px";
    document.getElementById("carte").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("results").style.width = "0";
    document.getElementById("carte").style.marginLeft= "0";
}

function toutCocher(){
    var checkbox = document.getElementById("checkbox");

    for(i = 0; i < checkbox.children.length; i ++){
        checkbox.children[i].children[0].checked = true;
    }
    chargeChart();
}

function toutDecocher(){
    var checkbox = document.getElementById("checkbox");

    for(i = 0; i < checkbox.children.length; i ++){
        checkbox.children[i].children[0].checked = false;
    }
    chargeChart();
}

function sortQuartierAlphabetic(){

    var tab = JSON.parse(localStorage.getItem("DistrictTab"));
    var res = [];
    var res2 = [];

    tab.forEach(function(item){
        res.push(item.name);
    })

    res.sort();

    res.forEach(function(item){
        tab.forEach(function(quart){
            if(quart.name == item){
                res2.push(quart);
            }
        })
    })

    localStorage.setItem("DistrictTab", JSON.stringify(res2));
    listQuartier();
    chargeChart();
}

function sortQuartierNbBornes(){

    var l = JSON.parse(localStorage.getItem("DistrictTab"));

    for(var i= 0 ; i< l.length; i++){ 
        for(var j=i+1; j< l.length; j++){
            if(l[j].nbborne > l[i].nbborne){
                var temp = l[j];
                l[j]=l[i];
                l[i]=temp;
                }
        }
    }
    localStorage.setItem("DistrictTab", JSON.stringify(l));
    listQuartier();
    chargeChart();
}

function sortQuartierNearCentreVille(){

    var l = JSON.parse(localStorage.getItem("DistrictTab"));
    var coord_centre_ville = [43.6043, 1.4437];
    

    for(var i= 0 ; i< l.length; i++){ 
        for(var j=i+1; j< l.length; j++){

            if(dist(l[j].coord, coord_centre_ville) < dist(l[i].coord, coord_centre_ville)){
                
                var temp = l[j];
                l[j]=l[i];
                l[i]=temp;
                }
        }
    }
    
    localStorage.setItem("DistrictTab", JSON.stringify(l));
    listQuartier();
    chargeChart();

}
