const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectRedis } = require("../shared/config/redis");
const { connectRabbitMQ } = require("../shared/config/rabbitmq");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const redisClient = connectRedis();

let channel;

const initializeRabbitMQ = async () => {
    try {
        channel = await connectRabbitMQ();
        console.log("RabbitMQ connected successfully");
    } catch (err) {
        console.error("RabbitMQ connection failed:", err);
        process.exit(1);
    }
};

const ensureRabbitMQ = (req, res, next) => {
    if (!channel) {
        return res.status(503).json({ error: "RabbitMQ channel not initialized" });
    }
    next();
};

app.get("/", (req, res) => {
    res.send("Welcome to the E-Commerce Backend Service!");
});

// TEST- REDIS

// app.get("/cache", async (req, res) => {
//     try {
//         await redisClient.set("exampleKey", "Hello Redis!");
//         const value = await redisClient.get("exampleKey");
//         res.json({ message: value });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// TEST- RABBITMQ

// app.post("/publish", ensureRabbitMQ, async (req, res) => {
//     try {
//         const { queue, message } = req.body;
//         if (!queue || !message) {
//             return res.status(400).json({ error: "Queue and message are required" });
//         }

//         await channel.assertQueue(queue);
//         channel.sendToQueue(queue, Buffer.from(message));
//         res.json({ success: true, message: `Message sent to queue: ${queue}` });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


initializeRabbitMQ().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port : ${PORT}`);
    });
});
