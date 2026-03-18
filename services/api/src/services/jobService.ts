import { AppError, PipelineAction } from "../../../../types";
import { createJob, getAllJobs, getJobById } from "../db/queries/jobQueries";
import { getPipelineBySourcePath } from "../db/queries/pipelineQueries";

type WebhookPayload = Record<string, unknown>;

function determinePriority(payload: WebhookPayload): number {
  const status = payload.status;
  const rating = payload.rating;

  if (status === "canceled") return 3;
  if (typeof rating === "number" && rating <= 2) return 3;
  if (status === "delayed") return 2;

  return 1;
}

function getDeliveryIdFromPayload(payload: WebhookPayload): string | null {
  const deliveryId = payload.deliveryId ?? payload.delivery_id;
  return typeof deliveryId === "string" ? deliveryId : null;
}

export async function createJobFromWebhook(
  sourcePath: string,
  payload: WebhookPayload,
) {
  const pipeline = await getPipelineBySourcePath(sourcePath);

  if (!pipeline) {
    throw new AppError("PIPELINE_NOT_FOUND", "Pipeline not found", 404);
  }

  const priority = determinePriority(payload);
  const deliveryId = getDeliveryIdFromPayload(payload);

  const job = await createJob({
    pipelineId: pipeline.id,
    deliveryId,
    jobType: pipeline.actionType as PipelineAction,
    status: "pending",
    priority,
    payload,
    result: null,
    attemptCount: 0,
    maxAttempts: 3,
    errorMessage: null,
    lastAttemptAt: null,
    lockedAt: null,
  });

  return { pipeline, job };
}

export async function getAllJobsService() {
  return getAllJobs();
}

export async function getJobByIdService(id: string) {
  const job = await getJobById(id);

  if (!job) {
    throw new AppError("JOB_NOT_FOUND", "Job not found", 404);
  }

  return job;
}
