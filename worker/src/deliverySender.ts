import { ActionResult, Job } from "../../types";
import {
  createDeliveryAttempt,
  markDeliveryAttemptFailed,
  markDeliveryAttemptSuccess,
} from "../../services/api/src/db/queries/deliveryAttemptQueries";
import { getSubscribersByPipelineId } from "../../services/api/src/db/queries/subscriberQueries";
import { createAlert } from "../../services/api/src/db/queries/alertQueries";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function deliverJobResultToSubscribers(
  job: Job,
  actionResult: ActionResult,
) {
  const subscribers = await getSubscribersByPipelineId(job.pipelineId);

  if (!subscribers.length) {
    return [];
  }
  const results = [];

  for (const subscriber of subscribers) {
    const attemptRecord = await createDeliveryAttempt({
      jobId: job.id,
      subscriberId: subscriber.id,
      status: "pending",
      attemptCount: 0,
      responseStatus: null,
      responseBody: null,
      lastAttemptAt: null,
    });

    let delivered = false;
    let lastStatus: number | null = null;
    let lastBody: string | null = null;

    const retryDelays = [0, 1000, 3000]; // immediate, 1s, 3s

    for (let i = 0; i < retryDelays.length; i++) {
      if (retryDelays[i] > 0) {
        await sleep(retryDelays[i]);
      }

      try {
        const response = await fetch(subscriber.targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId: job.id,
            pipelineId: job.pipelineId,
            jobType: job.jobType,
            result: actionResult,
          }),
        });

        lastStatus = response.status;
        lastBody = await response.text();

        if (response.ok) {
          await markDeliveryAttemptSuccess(
            attemptRecord.id,
            response.status,
            lastBody,
            i + 1,
          );

          results.push({
            subscriberId: subscriber.id,
            status: "success",
            responseStatus: response.status,
          });

          delivered = true;
          break;
        }
      } catch (error) {
        lastStatus = null;
        lastBody =
          error instanceof Error
            ? error.message
            : "Unknown subscriber delivery error";
      }
    }

    if (!delivered) {
      await markDeliveryAttemptFailed(
        attemptRecord.id,
        lastStatus,
        lastBody,
        retryDelays.length,
      );
      await createAlert({
        deliveryId: job.deliveryId ?? null,
        driverId: null,
        type: "subscriber_failure",
        message: `Subscriber delivery failed for subscriber ${subscriber.id} after retries`,
        sourceJobId: job.id,
      });

      results.push({
        subscriberId: subscriber.id,
        status: "failed",
        responseStatus: lastStatus,
      });
    }
  }

  return results;
}
