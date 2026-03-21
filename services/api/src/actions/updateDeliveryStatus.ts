import { ActionResult, AppError, DeliveryStatus, Job } from "../../../../types";
import {
  getDeliveryById,
  updateDeliveryById,
} from "../db/queries/deliveryQueries";

type UpdateDeliveryPayload = {
  deliveryId?: string;
  delivery_id?: string;
  driverId?: string;
  driver_id?: string;
  status?: DeliveryStatus;
  eta?: string;
};

function getPayload(job: Job): UpdateDeliveryPayload {
  if (!job.payload || typeof job.payload !== "object") {
    throw new AppError("INVALID_PAYLOAD", "Job payload must be an object", 400);
  }

  return job.payload as UpdateDeliveryPayload;
}

export async function updateDeliveryStatus(job: Job): Promise<ActionResult> {
  const payload = getPayload(job);

  const deliveryId = payload.deliveryId ?? payload.delivery_id;
  const driverId = payload.driverId ?? payload.driver_id ?? null;
  const status = payload.status;
  const eta = payload.eta ? new Date(payload.eta) : null;

  if (!deliveryId || typeof deliveryId !== "string") {
    throw new AppError("INVALID_PAYLOAD", "deliveryId is required", 400);
  }

  if (!status) {
    throw new AppError("INVALID_PAYLOAD", "status is required", 400);
  }

  const existingDelivery = await getDeliveryById(deliveryId);

  if (!existingDelivery) {
    throw new AppError(
      "JOB_PROCESSING_FAILED",
      `Delivery ${deliveryId} does not exist`,
      404,
    );
  }

  const updated = await updateDeliveryById(deliveryId, {
    driverId,
    status,
    eta,
  });

  return {
    action: "updateDeliveryStatus",
    success: true,
    operation: "updated",
    delivery: updated,
  };
}
