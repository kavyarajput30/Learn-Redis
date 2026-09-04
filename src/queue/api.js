import express from 'express';
import Redis from 'ioredis';
import {emailQueue} from './queue.js';

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(express.json());

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

app.post('/enqueue', async (req, res) => {
  const job = await emailQueue.add("send-email", {
    to: req.body.to,
    subject: req.body.subject,
    body: req.body.body,
    name: req.body.name
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  });
  return res.status(200).json({ jobId: job.id, message: 'Job enqueued successfully' });
});