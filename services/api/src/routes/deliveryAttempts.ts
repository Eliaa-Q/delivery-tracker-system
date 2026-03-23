import { Router } from "express";
import { getAllDeliveryAttemptsService } from "../services/deliveryAttemptService";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const attempts = await getAllDeliveryAttemptsService();
    return res.json(attempts);
  } catch (error) {
    console.error("Failed to fetch delivery attempts:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch delivery attempts",
    });
  }
});

export default router;
