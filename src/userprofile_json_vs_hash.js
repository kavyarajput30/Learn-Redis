import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
app.listen(3000, () => {
    console.log("server is listening to port 3000");
});

app.post("/user/:id/json", async (req, res) => {
    const user_id = req.params.id;
    const user_data = req.body;
    await redis.set(`user:${user_id}:json`, JSON.stringify(user_data));
    res.send("User data stored as JSON");
});
app.get("/user/:id/json", async (req, res) => {
    const user_id = req.params.id;
    const data = await redis.get(`user:${user_id}:json`);
    res.send(JSON.parse(data));
});
app.post("/user/:id/hash", async (req, res) => {
    const user_id = req.params.id;
    const data = await redis.hset(`user:${user_id}:hash`, req.body);
    res.send("User data stored as Hash");
});
app.get("/user/:id/hash", async (req, res) => {
    const user_id = req.params.id;
    const data = await redis.hgetall(`user:${user_id}:hash`); // means return me complete hash data
    //hget
    //hgetall
    //hdel
    //hexists
    res.send(data); // we do not need to parse it because it is already in object format
});