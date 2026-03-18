import { Job } from "../../../../types";

export async function delayAlertChain(job: Job) {
  return {
    action: "delayAlertChain",
    jobId: job.id,
    processed: true,
  };
}
