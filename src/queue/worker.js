import { Worker } from 'bullmq';
import { connection } from './queue.js';


const worker = new Worker(
    "email",
    async (job) => {
        console.log(`Processing job ${job.id} with data:`, job.data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Email sent to ${job.data.to} with subject: ${job.data.subject}`);
    },
    { connection });

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`, job.data, job.returnvalue);
});
worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err);
});