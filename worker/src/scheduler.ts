import { getActiveDeliveriesForDelayCheck } from "../../services/api/src/db/queries/deliveryQueries";
import {
  createJob,
  getActiveJobByTypeAndDeliveryId,
} from "../../services/api/src/db/queries/jobQueries";
import { getPipelinesByActionType } from "../../services/api/src/db/queries/pipelineQueries";

export async function enqueueDetectDelayJobs() {
  const detectDelayPipelines = await getPipelinesByActionType("detectDelay");

  if (!detectDelayPipelines.length) {
    console.log("Scheduler: no detectDelay pipeline found");
    return [];
  }

  const pipeline = detectDelayPipelines[0];
  const activeDeliveries = await getActiveDeliveriesForDelayCheck();

  if (!activeDeliveries.length) {
    console.log("Scheduler: no active deliveries to check");
    return [];
  }

  const createdJobs = [];

  for (const delivery of activeDeliveries) {
    const existingJob = await getActiveJobByTypeAndDeliveryId(
      "detectDelay",
      delivery.id,
    );

    if (existingJob) {
      continue;
    }

    const job = await createJob({
      pipelineId: pipeline.id,
      deliveryId: delivery.id,
      jobType: "detectDelay",
      status: "pending",
      priority: 2,
      payload: {
        deliveryId: delivery.id,
      },
      result: null,
      attemptCount: 0,
      maxAttempts: 3,
      errorMessage: null,
      lastAttemptAt: null,
      lockedAt: null,
    });

    createdJobs.push(job);
  }

  console.log(`Scheduler: enqueued ${createdJobs.length} detectDelay job(s)`);

  return createdJobs;
}
