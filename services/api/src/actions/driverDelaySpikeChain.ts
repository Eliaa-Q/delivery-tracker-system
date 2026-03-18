import { Job } from "../../../../types";

export async function driverDelaySpikeChain(job: Job) {
  return {
    action: "driverDelaySpikeChain",
    jobId: job.id,
    processed: true,
  };
}
