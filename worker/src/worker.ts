import dotenv from "dotenv";
import { processNextJob } from "./jobProcessor";
import { enqueueDetectDelayJobs } from "./scheduler";

dotenv.config();

const POLL_INTERVAL_MS = 3000;
const DELAY_CHECK_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

async function startWorker() {
  console.log("Worker started");

  setInterval(async () => {
    try {
      const result = await processNextJob();

      if (result) {
        console.log("Worker result:", result);
      }
    } catch (error) {
      console.error("Worker loop error:", error);
    }
  }, POLL_INTERVAL_MS);

  setInterval(async () => {
    try {
      await enqueueDetectDelayJobs();
    } catch (error) {
      console.error("Scheduler error:", error);
    }
  }, DELAY_CHECK_INTERVAL_MS);
}

startWorker();
