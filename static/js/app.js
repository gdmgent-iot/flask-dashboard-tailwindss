const xValues = ["11:30:00", "11:30:05", "11:30:10"]; 
const yValues = [20, 21, 22];

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

    // update chart directly
    chart.data.datasets[0].data.push(temp);
    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.update();

    // keep only last 5
    const maxLen = 5;
    if (chart.data.datasets[0].data.length > maxLen) {
        chart.data.datasets[0].data.shift();
        chart.data.labels.shift();
        chart.update();
    }
});