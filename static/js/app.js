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
            text: "Temperatuur 🥵"
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

const humidityChart = new Chart("humidityChart", {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            backgroundColor: "blue",
            data: []
        }]
    },
    options: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: "Vochtigheid 💦"
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

const pressureChart = new Chart("pressureChart", {
    type: "doughnut",
    data: {
        labels: [],
        datasets: [{
            backgroundColor: ["#3e95cd", "FCFCFC"],
            data: []
        }]
    },
    options: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: "Luchtdruk 🌬"
        }

    }
});

// MQTT client
const mqttPath = "ws://mqtt.eclipseprojects.io/mqtt";
const client = mqtt.connect(mqttPath);

// MQTT topics
const topicTemperature = "IOT/temperature";
const topicHumidity = "IOT/humidity";
const topicPressure = "IOT/pressure";

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

    // subscribe to topic: Pressure
    client.subscribe(topicPressure);

});

// MQTT message
client.on("message", (topic, message) => {
    const data = message.toString();
    const sensorValue = parseFloat(data);
    console.log("MQTT message: ", sensorValue);
    console.log('Topic: ', topic);

    if(topic == topicTemperature) {
        // update dataset
        updateDataset(temperatureChart, sensorValue);

        // limit to x bars max
        limitToXBars(temperatureChart, 10);

        // give cool colors to chart
        giveCoolColorsToBars(temperatureChart);

        // update chart
        temperatureChart.update();
    }

    if(topic == topicHumidity) {
        // update dataset
        updateDataset(humidityChart, sensorValue);

        // limit to x bars max
        limitToXBars(humidityChart, 20);

        // update chart
        humidityChart.update();
    }

    if(topic == topicPressure) {
        // make dataset empty
        pressureChart.data.datasets[0].data = [];

        // update dataset
        updateDataset(pressureChart, sensorValue);
        updateDataset(pressureChart, 1100 - sensorValue);

        // limit to x bars max
        limitToXBars(pressureChart, 2);

        // update chart
        pressureChart.update();
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