const temperatureChart = new Chart("temperatureChart", {
    type: "bar",
    data: {
        labels: [],
        datasets: [{
            data: []
        }]
    },
    options: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: "Temperatuur"
        },
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 40
                }
            }]
        }
    }
});

// MQTT client
const mqttPath = "ws://mqtt.eclipseprojects.io/mqtt";
const client = mqtt.connect(mqttPath);

// MQTT topics
const topicTemperature = "IOT/temperature";
const topicHumidity = "IOT/humidity";

// MQTT connection
client.on("connect", () => {
    console.log("MQTT connected");
    
    // subscribe to topic: Temperature
    client.subscribe(topicTemperature, (err) => {
        if (!err) {
            console.log("MQTT subscribed to", topicTemperature);
        } else {
            console.log("MQTT subscription failed", err);
        }
    });

    // subscribe to topic: Humidity
    client.subscribe(topicHumidity);

});

// MQTT message
client.on("message", (topic, message) => {
    const data = message.toString();
    const temp = parseFloat(data);
    console.log("MQTT message: ", temp);
    console.log('Topic: ', topic);

    if(topic == topicTemperature) {
        // update dataset
        updateDataset(temperatureChart, temp);

        // limit to x bars max
        limitToXBars(temperatureChart, 10);

        // give cool colors to chart
        giveCoolColorsToBars(temperatureChart);

        // update chart
        temperatureChart.update();
    }

    if(topic == topicHumidity) {
        console.log("add to humidity chart");
    }
});


function updateDataset(chart, val) {
    chart.data.datasets[0].data.push(val);
    chart.data.labels.push(new Date().toLocaleTimeString());
}

function limitToXBars(chart, maxLen = 5) {
    if (chart.data.datasets[0].data.length > maxLen) {
        chart.data.datasets[0].data.shift();
        chart.data.labels.shift();
    }
}

function giveCoolColorsToBars(chart) {
    // temp > 27 make red
    // temp between 25 & 27 make orange
    // temp < 25 make green
    chart.data.datasets[0].backgroundColor = chart.data.datasets[0].data.map((temp) => {
        if (temp > 27) {
            return "red";
        } else if (temp > 25) {
            return "orange";
        } else {
            return "green";
        }
    });
}