$(document).ready(function(){

    Chart.defaults.global.title.display = true;
    Chart.defaults.global.title.text = "Répartition des bornes Wi-Fi par quartier";

    var ctx = document.getElementById('Charts').getContext('2d');
		var chart = new Chart(ctx, {
		type: 'line', // bar , radar , polarArea, buble , doughnut

        data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: '',
            backgroundColor: '#6CE779',
            borderColor: '#42AA4D',
            data: [0, 10, 5, 2, 20, 30, 45]
        }]
    },

    	// Configuration options go here
        options: {

        }
    });

    console.log(chart);


});
