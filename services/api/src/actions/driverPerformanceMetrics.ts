import { Job } from "../../../../types";

export async function driverPerformanceMetrics(job: Job) {
  return {
    action: "driverPerformanceMetrics",
    jobId: job.id,
    processed: true,
  };
}
