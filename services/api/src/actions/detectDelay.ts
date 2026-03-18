import { Job } from "../../../../types";

export async function detectDelay(job: Job) {
  return {
    action: "detectDelay",
    jobId: job.id,
    processed: true,
  };
}
