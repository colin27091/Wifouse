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
    
    tab.forEach(function(item) {
        top5.push([item[0], dist(coord, item[1])]);
    })

    for(var i= 0 ; i< top5.length; i++){ 
        for(var j=i+1; j< top5.length; j++){

            if(top5[j][1] < top5[i][1]){
                
                var temp = top5[j];
                top5[j]=top5[i];
                top5[i]=temp;
            }
        }
    }
    
    return top5.slice(0,10);
}

function getCoordWithAddress(adresse){

    $.getJSON('https://api-adresse.data.gouv.fr/search/?q='+adresse, function(data){

        var coord = data.features[0].geometry.coordinates;

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

var tab_rgb = [];
for(var i = 0; i < 60; i++){
    var rgb = "#";
    for(var j = 0; j < 3; j++){
        rgb += (Math.floor(Math.random() * 255)).toString(16); 
    }
    
    tab_rgb.push(rgb);
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
                backgroundColor: tab_rgb,
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

    var quartier_checked = getQuartierChecked();

    var label_data = disctrictToChart(quartier_checked);

    temp.data.labels = label_data[0]//Label
    temp.data.datasets[0].data = label_data[1]//Data
    chart = new Chart(ctx, temp);
};

function showInResult(tab){


    var results = document.getElementById("results");
    results.innerHTML ="";
    var croix = document.createElement("div");
    croix.id = "croixleft";
    croix.innerHTML = "<a><i class='fa fa-times'></i></a>";
    croix.style.float = "right";
    results.append(croix);
    croix.onclick = function(event){
        closeNav(results);
    }
    results.style.width = "250px";
    tab.forEach(function(item){
        var it = document.createElement('div');
        if(tab[0] == item){
            it.style.marginTop = "25px";
            it.style.borderTop = "1px solid rgba(0,0,0,.125)";
        }
        if(item[0].ID <= 84){
            it.id = "not_mine";
        } else {
            it.id = "mine";
        }

        var div = document.createElement('div');
        var name = document.createElement('h');
        name.innerText = item[0].fields.nom_connexion;
        var dist = document.createElement('h');
        dist.style.float = "right";
        dist.style.marginRight = "5px";
        dist.innerText = + item[1]+"km";
        div.append(name);
        div.append(dist);
        it.append(div);
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

function getFormToAdd(coord){

    var flag = true;
    var nom_connexion = document.getElementById("input_nom").value;
    if(nom_connexion == ""){
        flag = false;
    }
    var site = document.getElementById("input_site").value;
    if(site == ""){
        flag = false;
    }
    var annee = document.getElementById("input_annee_form").value;
    if(annee == ""){
        flag = false;
    }
    var dispo = document.getElementById("input_dispo").value;
    if(dispo == ""){
        flag = false;
    }
    var zone = document.getElementById("input_zone_form").value;
    if(zone == ""){
        flag = false;
    }

    if(flag){
        var new_terminal = {
            "fields": {
                "site" : site,
                "geo_point_2d" : [coord[1], coord[0]],
                "nom_connexion" : nom_connexion,
                "annee_installation" : annee,
                "disponibilite" : dispo,
                "zone_emission" : zone,
            },
            "geometry" : {
                "type": 'Point',
                "coordinates": [coord[0],coord[1]]
            }
        }
        document.getElementsByClassName('mapboxgl-popup')[0].remove();
        document.getElementById('drag').remove();
        
        addBorne(new_terminal);
    }
    
    

}

function giveUpForm(){
    document.getElementsByClassName('mapboxgl-popup')[0].remove();
    document.getElementById('drag').remove();
}

function changeTerminal(id, coord){


    var data_nom = document.getElementById('label_nom').textContent;
    var data_site = document.getElementById('label_site').textContent;
    var data_dispo = document.getElementById('label_dispo').textContent;

    var div = document.getElementById('InfoBorne');
    div.innerHTML = '';

    var row1 = document.createElement('div');
    row1.setAttribute("class" , "row");

    var row2 = document.createElement('div');
    row2.setAttribute("class" , "row");


    var col1 = document.createElement('div');
    col1.setAttribute("class" , "col");

    var col2 = document.createElement('div');
    col2.setAttribute("class" , "col sm-1");

    var col3 = document.createElement('div');
    col3.setAttribute("class" , "col sm-1");
    //fin de ligne et colonnes

    //nom de la connexion
    var nom = document.createElement('label');
    nom.setAttribute('id', 'Nnom');
    nom.innerText = "Nom de la connexion :  ";
    nom.setAttribute('for', 'input_nom');
    nom.style.float = 'left';
    nom.style.marginTop = "3px";

    var lnom = document.createElement('input');
    lnom.setAttribute('id', 'input_nom');
    lnom.setAttribute('value', data_nom);
    lnom.className = "form-control";

    col1.append(nom, lnom);
    row1.append(col1);
    //fin nom de la connexion

    //Nom du quartier(site)
    var site = document.createElement('label');
    site.setAttribute('id', 'Nsite');
    site.innerText = "Adresse : ";
    site.setAttribute('for', 'input_site');
    site.style.float = 'left';
    site.style.marginTop = "3px";

    var lsite = document.createElement('input');
    lsite.setAttribute('id', 'input_site');
    lsite.setAttribute('value', data_site);
    lsite.className = "form-control";

    col3.append(site,lsite);
    //fin 


    //année
    var annee = document.createElement('label');
    annee.setAttribute('id', 'Nannee');
    annee.innerText = "Installé en :" ;
    annee.setAttribute('for', 'input_annee');
    annee.style.float = 'left';
    annee.style.marginTop = "3px";

    var lannee = document.createElement('div');
    lannee.setAttribute('id', 'input_annee');
    lannee.className = "form-group";
    var annee_form = "<select id='input_annee_form' class='form-control'>";
    annee_form += "<option selected>2019</option>";
    for(var i = 2018; i > 2000; i --){
        annee_form += "<option>"+ i +"</option>";
    }
    annee_form += "</select>";
    lannee.innerHTML = annee_form;

    col2.append(annee,lannee);
    //fin année

    //dispo
    var dispo = document.createElement('label');
    dispo.setAttribute('id', 'Ndispo');
    dispo.innerText = "Disponibilité :";
    dispo.setAttribute('for', 'input_dispo');
    dispo.style.float = 'left';
    dispo.style.marginTop = "3px";

    var ldispo = document.createElement('input');
    ldispo.setAttribute('id', 'input_dispo');
    ldispo.setAttribute('value', data_dispo);
    ldispo.setAttribute('aria-describedby', 'Help');
    ldispo.className = "form-control";

    var ldispohelp = document.createElement('small');
    ldispohelp.id = 'Help';
    ldispohelp.className = "form-text text-muted";
    ldispohelp.innerText = "ex:24/24h(avec garantie de service)";
    ldispohelp.style.float = 'left';

    col2.append(dispo,ldispo, ldispohelp);
    //fin dispo

    

    //zone d'emission 
    var zone = document.createElement('label');
    zone.setAttribute('id', 'Nzone');
    zone.innerText = "Zone d'émission : ";
    zone.setAttribute('for', 'input_zone');
    zone.style.float = 'left';
    zone.style.marginTop = "19px";

    var lzone = document.createElement('div');
    lzone.setAttribute('id', 'input_zone');
    lzone.className = "form-group col zonemargin";
    lzone.innerHTML ="<select id='input_zone_form' class='form-control'>"
                    +"<option selected>Intérieur</option>"
                    + "<option>Extérieur</option>"
                    +"</select>";
    
    col3.append(zone,lzone);
    //fin zone d'emission

    //button
    var save = document.createElement('button');
    var cancel = document.createElement('button');

    cancel.setAttribute("class", "btn btn-outline-danger btn-sm");
    cancel.setAttribute("id", "butform");
    cancel.setAttribute('onclick', 'giveUpForm()');
    cancel.style.float = 'right';
    cancel.innerText = "Annuler";

    save.setAttribute("class", "btn btn-outline-success btn-sm");
    save.setAttribute("id", "butform");
    save.setAttribute('onclick', 'updateTer('+ id +','+JSON.stringify(coord)+")" );
    save.style.float = 'right';
    save.innerText = "Sauvegarder";
    //fin button

    
    
    row2.append(col2, col3);
    div.append(row1);
    div.append(row2);
    div.append(cancel,save);
    
}


function updateTer(id, coord){


    var flag = true;
    var nom_connexion = document.getElementById("input_nom").value;
    if(nom_connexion == ""){
        flag = false;
    }
    var site = document.getElementById("input_site").value;
    if(site == ""){
        flag = false;
    }
    var annee = document.getElementById("input_annee_form").value;
    if(annee == ""){
        flag = false;
    }
    var dispo = document.getElementById("input_dispo").value;
    if(dispo == ""){
        flag = false;
    }
    var zone = document.getElementById("input_zone_form").value;
    if(zone == ""){
        flag = false;
    }

    if(flag){
        var terminal = {
            'ID': id,
            "fields": {
                "site" : site,
                "geo_point_2d" : [coord[1],coord[0]],
                "nom_connexion" : nom_connexion,
                "annee_installation" : annee,
                "disponibilite" : dispo,
                "zone_emission" : zone,
            },
            "geometry" : {
                "type": 'Point',
                "coordinates": [coord[0],coord[1]]
            }
        }
        document.getElementsByClassName('mapboxgl-popup')[0].remove();
        
        
        modifTerminal(terminal);
        centerOnId(id);
    }
}