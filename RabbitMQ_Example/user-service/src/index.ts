import express from "express";
import cors from 'cors';
import amqp from "amqplib";

const app = express();
const PORT = 9090;

app.use(cors());
app.use(express.json());

const queue = "product_inventory";

let connection: amqp.Connection;
let channel: amqp.Channel;

async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672/");
    channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: false });
    console.log("Connected to RabbitMQ and created channel");

    channel.consume(queue, async (msg) => {
      const messageObject = JSON.parse(msg.content.toString());
      console.log("LOOKK", messageObject);
    })
  } catch (err) {
    // TODO Very simple reconnect strategy here - could do weird stuff be aware!
    setTimeout(connectToRabbitMQ, 5000);
    console.warn(err);
  }
}

connectToRabbitMQ();

app.get("/", (req, res) => {
  res.send({ data: "hello there from USER_SERVICE" });
});

app.listen(PORT, () => console.log(`Express server instantiated PORT ${PORT}`));
