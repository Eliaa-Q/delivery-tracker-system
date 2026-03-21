import { Router } from "express";
import {
  getAllFeedbackService,
  getFeedbackByDeliveryIdService,
} from "../services/feedbackService";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const feedback = await getAllFeedbackService();
    return res.json(feedback);
  } catch (error) {
    console.error("Failed to fetch feedback:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch feedback",
    });
  }
});

router.get("/delivery/:deliveryId", async (req, res) => {
  try {
    const feedback = await getFeedbackByDeliveryIdService(
      req.params.deliveryId,
    );
    return res.json(feedback);
  } catch (error) {
    console.error("Failed to fetch delivery feedback:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch delivery feedback",
    });
  }
});

export default router;
