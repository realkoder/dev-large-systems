import express from "express";
import cors from 'cors';
import amqp from "amqplib";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

const queue = "product_inventory";
const text = {
  id: "macbook",
  text: "This is a sample message to send receiver to check the ordered Item Availablility",
};

let connection: amqp.Connection;
let channel: amqp.Channel;

async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672/");
    channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: false });
    console.log("Connected to RabbitMQ and created channel");
  } catch (err) {
    // TODO Very simple reconnect strategy here - could do weird stuff be aware!
    setTimeout(connectToRabbitMQ, 5000);
    console.warn(err);
  }
}

async function publishMessage(message: { id: string, text: string }) {
  try {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(" [x] Sent '%s'", message);
  } catch (err) {
    console.warn(err);
  }
}

connectToRabbitMQ();

app.post("/publish", (req, res) => {
  // const message = req.body;
  publishMessage(text);
  res.send({ data: "Message published to RabbitMQ" });
});

app.get("/", (req, res) => {
  res.send({ data: "hello there from PRODUCT_SERVICE" });
});

app.listen(PORT, () => console.log(`Express server instantiated PORT ${PORT}`));
