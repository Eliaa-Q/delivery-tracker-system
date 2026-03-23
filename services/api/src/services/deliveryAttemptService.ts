import { getAllDeliveryAttempts } from "../db/queries/deliveryAttemptQueries";

export async function getAllDeliveryAttemptsService() {
  return getAllDeliveryAttempts();
}
