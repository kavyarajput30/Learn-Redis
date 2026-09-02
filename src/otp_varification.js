import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.listen(3000, () => {
    console.log("Server is listening at port 3000");
});

function otpKey(phone) {
    return `otp:${phone}`;
};

app.post("/otp/:phone", async (req, res) => {
    const phone = req.params.phone;
    const otp = Math.floor(Math.random() * 1000000);
    await redis.set(otpKey(phone), otp, "EX", (2 * 60));
    res.json({
        success: true,
        message: `OTP sent to ${phone}`,
        otp: otp
    });
});

app.post("/otp/verify/:phone", async (req, res) => {
    const phone = req.params.phone;
    console.log("Verifying OTP for phone:", phone);
    const deliveredOTP = req.body.otp;
    console.log("Delivered OTP:", deliveredOTP);
    const ifExist = await redis.exists(otpKey(phone));
    console.log("OTP existence check result:", ifExist);
    if (ifExist === 0) {
        res.json({
            success: false,
            message: "OTP expired or does not exist"
        });
        return;
    }
    const storedOTP = await redis.get(otpKey(phone));
    console.log("Stored OTP after retrieval:", storedOTP);
    if (storedOTP === deliveredOTP) {
        res.json({
            success: true,
            message: "OTP verified successfully"
        });
        await redis.del(otpKey(phone));
    } else {
        res.json({
            success: false,
            message: "Invalid OTP"
        });
    }
});

app.get("/otp/:phone", async (req, res) => {
    const phone = req.params.phone;
    const ttl = await redis.ttl(otpKey(phone));
    console.log(ttl);
    if(ttl === -2) {
        res.json({
            success: false,
            message: "OTP does not exist or has expired"
        });
        return;
    }
    res.json({
        success: true,
        ttl: ttl
    })
});
