$(document).ready(function(){

    Chart.defaults.global.title.display = true;
    Chart.defaults.global.title.text = "Répartition des bornes Wi-Fi par quartier";

    var chart ={
        type: 'line', // bar , radar , polarArea, buble , doughnut

        data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: '',
            backgroundColor: '#42AA4D',
            borderColor: '42AA4D',
            data: [0, 10, 5, 2, 20, 30, 45]
        }]
    },

    	// Configuration options go here
        options: {

        }
    };

    var myChart;

    change("line");

    $("#inputState").change(function(event){

        var type = document.getElementById("inputState").value;

        console.log(type);

        switch(type){
            case "Lignes":
                change("line");
                break;
            case "Colonnes":
                change("bar");
                break;
            case "Nuage de points":
                change("bubble");
                break;
            case "Radar":
                change("radar");
                break;
            case "Polaire":
                change("polarArea");
                break;
            case "Donuts":
                change("doughnut");
                break;
                
        }

    });


    function change(newType) {


        console.log(newType);

        var ctx = document.getElementById("Charts").getContext("2d");
        // Remove the old chart and all its event handles
        if (myChart) {
            myChart.destroy();
        }
        // Chart.js modifies the object you pass in. Pass a copy of the object so we can use the original object later
        var temp = jQuery.extend(true, {}, chart);
        temp.type = newType;
        myChart = new Chart(ctx, temp);
    };


});