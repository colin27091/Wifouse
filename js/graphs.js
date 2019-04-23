$(document).ready(function(){

    Chart.defaults.global.title.display = true;
    Chart.defaults.global.title.text = "Répartition des bornes Wi-Fi par quartier";

    var ctx = document.getElementById('Charts').getContext('2d');

    var chart = new Chart(ctx, {
        type: 'line',

        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: '',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45]
            }]
        },

        // Configuration options go here
        options: {

        }
    });

    console.log(chart);


});
