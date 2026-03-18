import { Job } from "../../../../types";

export async function feedbackIntegration(job: Job) {
  return {
    action: "feedbackIntegration",
    jobId: job.id,
    processed: true,
  };
}
