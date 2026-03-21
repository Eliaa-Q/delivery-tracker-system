import { AppError } from "../../../../types";
import {
  getAllDeliveries,
  getDeliveryById,
} from "../db/queries/deliveryQueries";
import { getEventsByDeliveryId } from "../db/queries/eventQueries";

export async function getAllDeliveriesService() {
  return getAllDeliveries();
}

export async function getDeliveryByIdService(id: string) {
  const delivery = await getDeliveryById(id);

  if (!delivery) {
    throw new AppError("JOB_PROCESSING_FAILED", "Delivery not found", 404);
  }

  return delivery;
}
export async function getDeliveryEventsService(deliveryId: string) {
  const delivery = await getDeliveryById(deliveryId);

  if (!delivery) {
    throw new AppError("JOB_PROCESSING_FAILED", "Delivery not found", 404);
  }

  return getEventsByDeliveryId(deliveryId);
}
