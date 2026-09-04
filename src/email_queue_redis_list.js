import express from "express";
import Redis from "redis";


const app = express();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
app.use(express.json());


app.listen(3000, (req, res) => {
      console.log("Server is listening to port 3000");
});
const QUEUE_KEY = "queue:email";
app.post("/send-email", async (req, res) => {
      const { to, subject, body } = req.body;
      const job = {
            to,
            subject,
            body,
            createdAt: new Date().toISOString(),
      };
      await redis.lpush(QUEUE_KEY, JSON.stringify(job));
      res.status(200).json({ message: "Email job added to the queue" });
});
app.get("/process-email", async (req, res) => {
    const job = await redis.rpop(QUEUE_KEY);
    if (job) {
        const emailJob = JSON.parse(job);
        // Here you would normally send the email using an email service
        console.log(`Processing email job: ${JSON.stringify(emailJob)}`);
        res.status(200).json({ message: "Email job processed", job: emailJob });
    } else {
        res.status(200).json({ message: "No email jobs in the queue" });
    }
});
