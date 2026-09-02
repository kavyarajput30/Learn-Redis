import express from "express";
import Redis from "ioredis";


const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/redis", async (req, res) => {
    await redis.set(BANNER_KEY, req.body.banner);
    res.json({
        message: "Banner saved successfully",
        success: true
    });
});
app.get("/redis", async (req, res) => {
    const banner = await redis.get(BANNER_KEY);
    res.json({
        success: true,
        banner: banner
    });
});
app.delete("/redis", async (req, res) => {
    await redis.del(BANNER_KEY);
    res.json({
        message: "Banner deleted successfully",
        success: true
    });
});
app.get("/banner/exist", async (req, ress) => {
    const res = await redis.exists(BANNER_KEY);
    if (res === 1) {
        ress.json({
            success: true,
            message: "Banner exists"
        });
    } else {
        ress.json({
            success: false,
            message: "Banner does not exist"
        });
    }
})

const BANNER_KEY = "app:banner";