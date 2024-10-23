const xValues = []; 
const yValues = [];

const chart = new Chart("myChart", {
    type: "bar",
    data: {
    labels: xValues,
    datasets: [{
        backgroundColor: "red",
        data: yValues
    }]
    },
    options: {
        legend: {display: false},
        title: {
            display: true,
            text: "Temperatuurregistratie"
        },
        scales: {
            y: {
                min: 15,
                max: 40
            }
        }
    }
});

// MQTT client
const mqttPath = "ws://mqtt.eclipseprojects.io/mqtt";
const client = mqtt.connect(mqttPath);

// MQTT topics
const topicTemperature = "IOT/temperature";

// MQTT connection
client.on("connect", () => {
    console.log("MQTT connected");
    client.subscribe(topicTemperature, (err) => {
        if (!err) {
            console.log("MQTT subscribed to", topicTemperature);
        } else {
            console.log("MQTT subscription failed", err);
        }
    });
});

// MQTT message
client.on("message", (topic, message) => {
    const data = message.toString();
    const temp = parseFloat(data);
    console.log("MQTT message", temp);

    // update dataset
    updateDataset(temp);

    // limit to x bars max
    limitToXBars(10);

    // give cool colors to chart
    giveCoolColorsToBars();

    // update chart
    chart.update();
});

function updateDataset(temp) {
    chart.data.datasets[0].data.push(temp);
    chart.data.labels.push(new Date().toLocaleTimeString());
}

function limitToXBars(maxLen = 5) {
    if (chart.data.datasets[0].data.length > maxLen) {
        chart.data.datasets[0].data.shift();
        chart.data.labels.shift();
    }
}

function giveCoolColorsToBars() {
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