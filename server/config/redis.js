const Redis = require("ioredis");
const redis = new Redis({
  host: "127.0.0.1", // Redis server host
  port: 6379, // Redis server port
  password: "", // Add if using a password
  db: 0, // Redis database index (default is 0)
});

redis.on("connect", () => {
  console.log("Connected to Redis...");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = redis;
