import { ActionResult, AppError, Job } from "../../../../types";
import { createAnalyticsRecord } from "../db/queries/analyticsQueries";
import { getDriverById } from "../db/queries/driverQueries";

type DriverDelaySpikePayload = {
  driverId?: string | null;
  averageRating?: number;
  feedbackCount?: number;
  rating?: number;
  comment?: string | null;
  reason?: string;
};

function getPayload(job: Job): DriverDelaySpikePayload {
  if (!job.payload || typeof job.payload !== "object") {
    throw new AppError("INVALID_PAYLOAD", "Job payload must be an object", 400);
  }

  return job.payload as DriverDelaySpikePayload;
}

export async function driverDelaySpikeChain(job: Job): Promise<ActionResult> {
  const payload = getPayload(job);

  const driverId = payload.driverId;

  if (!driverId || typeof driverId !== "string") {
    throw new AppError("INVALID_PAYLOAD", "driverId is required", 400);
  }

  const driver = await getDriverById(driverId);

  if (!driver) {
    throw new AppError(
      "JOB_PROCESSING_FAILED",
      `Driver ${driverId} not found`,
      404,
    );
  }

  const reason = payload.reason ?? "Driver escalation triggered";

  const escalationMetric = await createAnalyticsRecord({
    driverId,
    metric: "driver_escalation",
    value: 1,
  });

  return {
    action: "driverDelaySpikeChain",
    success: true,
    escalated: true,
    reason,
    driver,
    analytics: escalationMetric,
    context: {
      averageRating: payload.averageRating ?? null,
      feedbackCount: payload.feedbackCount ?? null,
      rating: payload.rating ?? null,
      comment: payload.comment ?? null,
      sourceJobId: job.id,
    },
  };
}
