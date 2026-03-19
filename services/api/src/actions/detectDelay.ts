import { ActionResult, AppError, Job } from "../../../../types";
import {
  getDeliveryById,
  updateDeliveryById,
} from "../db/queries/deliveryQueries";

type DetectDelayPayload = {
  deliveryId?: string;
  delivery_id?: string;
  eta?: string;
};

function getPayload(job: Job): DetectDelayPayload {
  if (!job.payload || typeof job.payload !== "object") {
    throw new AppError("INVALID_PAYLOAD", "Job payload must be an object", 400);
  }

  return job.payload as DetectDelayPayload;
}

export async function detectDelay(job: Job): Promise<ActionResult> {
  const payload = getPayload(job);

  const deliveryId = payload.deliveryId ?? payload.delivery_id;

  if (!deliveryId || typeof deliveryId !== "string") {
    throw new AppError("INVALID_PAYLOAD", "deliveryId is required", 400);
  }

  const delivery = await getDeliveryById(deliveryId);

  if (!delivery) {
    throw new AppError(
      "JOB_PROCESSING_FAILED",
      `Delivery ${deliveryId} not found`,
      404,
    );
  }

  const now = new Date();
  const eta = delivery.eta ?? (payload.eta ? new Date(payload.eta) : null);

  if (!eta) {
    return {
      action: "detectDelay",
      success: true,
      delayed: false,
      reason: "No ETA available",
      delivery,
    };
  }

  if (delivery.status === "delivered" || delivery.status === "canceled") {
    return {
      action: "detectDelay",
      success: true,
      delayed: false,
      reason: `Delivery already ${delivery.status}`,
      delivery,
    };
  }

  const isDelayed = eta.getTime() < now.getTime();

  if (!isDelayed) {
    return {
      action: "detectDelay",
      success: true,
      delayed: false,
      reason: "ETA has not passed yet",
      delivery,
    };
  }

  const updatedDelivery = await updateDeliveryById(deliveryId, {
    status: "delayed",
  });

  return {
    action: "detectDelay",
    success: true,
    delayed: true,
    reason: "ETA has passed",
    delivery: updatedDelivery,
    nextJob: {
      jobType: "delayAlertChain",
      priority: 3,
      payload: {
        deliveryId,
        status: "delayed",
        reason: "ETA has passed",
      },
      deliveryId,
      maxAttempts: 3,
    },
  };
}
