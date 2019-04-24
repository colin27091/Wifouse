$(document).ready(function(){

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

    var chart;
    chargeChart(chart, chart_pattern);
    
    $("#inputState").change(function(event){
        chargeChart(chart, chart_pattern);
    });
    


});

function chargeChart(chart, chart_pattern) {

        var ctx = document.getElementById("Charts").getContext("2d");
        // Remove the old chart and all its event handles
        if (chart) {
            chart.destroy();
        }
        // Chart.js modifies the object you pass in. Pass a copy of the object so we can use the original object later
        var temp = jQuery.extend(true, {}, chart_pattern);

        temp.type = getGraphForm();

        var label_data = getDistrictChecked();
        temp.data.labels = label_data[0]//Label
        temp.data.datasets[0].data = label_data[1]//Data
        chart = new Chart(ctx, temp);
};

