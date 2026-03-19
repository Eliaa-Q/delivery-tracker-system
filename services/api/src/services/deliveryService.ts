import { AppError } from "../../../../types";
import {
  getAllDeliveries,
  getDeliveryById,
} from "../db/queries/deliveryQueries";

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
