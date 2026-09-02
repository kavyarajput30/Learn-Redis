import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const mongo = mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/redis_mongo_docker");

app.get("/redis", async (req, res) => {
    const result = await redis.ping();
    res.send(`Redis ping response: ${result}`);
});
app.get("/mongo", async (req, res) => {
    res.send("Connected");
});