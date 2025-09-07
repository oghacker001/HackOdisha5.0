// config/redis.js

const Redis = require("ioredis");

// Connect to Redis using the environment variable
const redisClient = new Redis(process.env.REDIS_URI);

redisClient.on("connect", () => {
    console.log("✅ Redis Client Connected");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis Client Error:", err);
});

module.exports = redisClient;