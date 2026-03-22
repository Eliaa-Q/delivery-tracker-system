import {
  getAllAlerts,
  getAlertsByDeliveryId,
  getAlertsByDriverId,
} from "../db/queries/alertQueries";

export async function getAllAlertsService() {
  return getAllAlerts();
}

export async function getAlertsByDeliveryIdService(deliveryId: string) {
  return getAlertsByDeliveryId(deliveryId);
}

export async function getAlertsByDriverIdService(driverId: string) {
  return getAlertsByDriverId(driverId);
}
