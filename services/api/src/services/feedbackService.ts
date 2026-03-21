import {
  getAllFeedback,
  getFeedbackByDeliveryId,
} from "../db/queries/feedbackQueries";

export async function getAllFeedbackService() {
  return getAllFeedback();
}

export async function getFeedbackByDeliveryIdService(deliveryId: string) {
  return getFeedbackByDeliveryId(deliveryId);
}
