import { ActionResult, AppError, Job } from "../../../../types";
import { getDeliveryById } from "../db/queries/deliveryQueries";
import { createDeliveryEvent } from "../db/queries/eventQueries";

type DelayAlertPayload = {
  deliveryId?: string;
  reason?: string;
  status?: string;
};

function getPayload(job: Job): DelayAlertPayload {
  if (!job.payload || typeof job.payload !== "object") {
    throw new AppError("INVALID_PAYLOAD", "Job payload must be an object", 400);
  }

  return job.payload as DelayAlertPayload;
}

export async function delayAlertChain(job: Job): Promise<ActionResult> {
  const payload = getPayload(job);

  const deliveryId = payload.deliveryId;

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

  const event = await createDeliveryEvent({
    deliveryId,
    eventType: "delay_detected",
    payload: {
      reason: payload.reason ?? "Delay detected",
      status: payload.status ?? delivery.status,
      sourceJobId: job.id,
    },
  });

  return {
    action: "delayAlertChain",
    success: true,
    alertTriggered: true,
    message: `Delay alert recorded for delivery ${deliveryId}`,
    delivery,
    event,
  };
}
