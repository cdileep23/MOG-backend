// redisClient.ts
import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error", err));


(async () => {
  try {
    await redisClient.connect();
    console.log("🔌 Redis connected");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
})();

export default redisClient;
