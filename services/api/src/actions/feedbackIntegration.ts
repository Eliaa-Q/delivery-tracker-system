import { ActionResult, AppError, Job } from "../../../../types";
import { getDeliveryById } from "../db/queries/deliveryQueries";
import { createFeedback } from "../db/queries/feedbackQueries";

type FeedbackIntegrationPayload = {
  deliveryId?: string;
  delivery_id?: string;
  rating?: number;
  comment?: string;
};

function getPayload(job: Job): FeedbackIntegrationPayload {
  if (!job.payload || typeof job.payload !== "object") {
    throw new AppError("INVALID_PAYLOAD", "Job payload must be an object", 400);
  }

  return job.payload as FeedbackIntegrationPayload;
}

export async function feedbackIntegration(job: Job): Promise<ActionResult> {
  const payload = getPayload(job);

  const deliveryId = payload.deliveryId ?? payload.delivery_id;
  const rating = payload.rating;
  const comment = payload.comment ?? null;

  if (!deliveryId || typeof deliveryId !== "string") {
    throw new AppError("INVALID_PAYLOAD", "deliveryId is required", 400);
  }

  if (typeof rating !== "number") {
    throw new AppError(
      "INVALID_PAYLOAD",
      "rating is required and must be a number",
      400,
    );
  }

  const delivery = await getDeliveryById(deliveryId);

  if (!delivery) {
    throw new AppError(
      "JOB_PROCESSING_FAILED",
      `Delivery ${deliveryId} not found`,
      404,
    );
  }

  const savedFeedback = await createFeedback({
    deliveryId,
    rating,
    comment,
  });

  return {
    action: "feedbackIntegration",
    success: true,
    feedbackRecorded: true,
    deliveryId,
    rating,
    comment,
    feedback: savedFeedback,
    nextJob: {
      jobType: "driverPerformanceMetrics",
      priority: rating <= 2 ? 3 : 2,
      payload: {
        deliveryId,
        driverId: delivery.driverId,
        reason: "Feedback received; recompute driver metrics",
      },
      deliveryId,
      maxAttempts: 3,
    },
  };
}
