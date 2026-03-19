import { ActionResult, Job } from "../../types";
import {
  completeJob,
  createJob,
  failJob,
  getNextPendingJob,
  lockJob,
  retryJob,
} from "../../services/api/src/db/queries/jobQueries";
import { runAction } from "./actionsRunner";

function hasNextJob(result: ActionResult): result is ActionResult & {
  nextJob: NonNullable<ActionResult["nextJob"]>;
} {
  return !!result.nextJob;
}

export async function processNextJob() {
  const nextJob = await getNextPendingJob();

  if (!nextJob) {
    return null;
  }

  const lockedJob = await lockJob(nextJob.id);

  if (!lockedJob) {
    return null;
  }

  try {
    const actionResult = await runAction(lockedJob as Job);

    if (hasNextJob(actionResult)) {
      await createJob({
        pipelineId: lockedJob.pipelineId,
        deliveryId:
          actionResult.nextJob.deliveryId ?? lockedJob.deliveryId ?? null,
        jobType: actionResult.nextJob.jobType,
        status: "pending",
        priority: actionResult.nextJob.priority,
        payload: actionResult.nextJob.payload,
        result: null,
        attemptCount: 0,
        maxAttempts: actionResult.nextJob.maxAttempts ?? 3,
        errorMessage: null,
        lastAttemptAt: null,
        lockedAt: null,
      });
    }

    await completeJob(lockedJob.id, actionResult);

    return {
      status: "completed",
      jobId: lockedJob.id,
      result: actionResult,
    };
  } catch (error) {
    const nextAttemptCount = (lockedJob.attemptCount ?? 0) + 1;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown processing error";

    if (nextAttemptCount < lockedJob.maxAttempts) {
      await retryJob(lockedJob.id, nextAttemptCount, errorMessage);

      return {
        status: "retrying",
        jobId: lockedJob.id,
        error: errorMessage,
        attemptCount: nextAttemptCount,
      };
    }

    await failJob(lockedJob.id, nextAttemptCount, errorMessage);

    return {
      status: "failed",
      jobId: lockedJob.id,
      error: errorMessage,
      attemptCount: nextAttemptCount,
    };
  }
}
