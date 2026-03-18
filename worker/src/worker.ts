import dotenv from "dotenv";
import { processNextJob } from "./jobProcessor";

dotenv.config();

const POLL_INTERVAL_MS = 3000;

async function startWorker() {
  console.log("Worker started");

  setInterval(async () => {
    try {
      const result = await processNextJob();

      if (result) {
        console.log("Worker processed job:", result);
      }
    } catch (error) {
      console.error("Worker loop error:", error);
    }
  }, POLL_INTERVAL_MS);
}

startWorker();
