const amqplib = require("amqplib");

const connectRabbitMQ = async () => {
    try {
        const connection = await amqplib.connect(process.env.RABBITMQ_URL || "amqp://localhost");
        const channel = await connection.createChannel();
        return channel;
    } catch (error) {
        console.error("RabbitMQ connection failed:", error);
        throw error;
    }
};

const publishMessage = async (channel, queue, message) => {
    try {
        if (!channel) throw new Error("RabbitMQ channel not initialized");
        await channel.assertQueue(queue);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`Message published to queue ${queue}`);
    } catch (error) {
        console.error("Error publishing message:", error);
    }
};

const consumeMessage = async (channel, queue, onMessage) => {
    try {
        if (!channel) throw new Error("RabbitMQ channel not initialized");
        await channel.assertQueue(queue);
        console.log(`Consuming messages from queue ${queue}`);
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                onMessage(JSON.parse(msg.content.toString()));
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Error consuming message:", error);
    }
};

module.exports = { connectRabbitMQ, publishMessage, consumeMessage };
