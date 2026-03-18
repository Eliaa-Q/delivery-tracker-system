import { Job } from "../../types";
import {
  completeJob,
  failJob,
  getNextPendingJob,
  lockJob,
  retryJob,
} from "../../services/api/src/db/queries/jobQueries";
import { runAction } from "./actionsRunner";

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

    await completeJob(lockedJob.id, actionResult);

    return {
      status: "completed",
      jobId: lockedJob.id,
      result: actionResult,
    };
  } catch (error) {
    const nextAttemptCount = (lockedJob.attemptCount ?? 0) + 1;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown job processing error";

    if (nextAttemptCount < lockedJob.maxAttempts) {
      await retryJob(lockedJob.id, nextAttemptCount, errorMessage);

      return {
        status: "retrying",
        jobId: lockedJob.id,
        error: errorMessage,
      };
    }

    await failJob(lockedJob.id, nextAttemptCount, errorMessage);

    return {
      status: "failed",
      jobId: lockedJob.id,
      error: errorMessage,
    };
  }
}
