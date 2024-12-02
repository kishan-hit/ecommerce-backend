const Redis = require("ioredis");

let redisClient;

const connectRedis = () => {
    try {
        redisClient = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

        redisClient.on("connect", () => {
            console.log("Redis connected successfully");
        });

        redisClient.on("error", (err) => {
            console.error("Redis connection error:", err);
        });

        return redisClient;
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
    }
};

module.exports = { connectRedis, redisClient };
