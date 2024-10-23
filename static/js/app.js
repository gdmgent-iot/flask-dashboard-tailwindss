// alert('MQTT goes here');

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
    console.log("Temperature: ", data);
});