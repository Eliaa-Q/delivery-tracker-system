import { Router } from "express";
import {
  getAllAnalyticsService,
  getAnalyticsByDriverIdService,
} from "../services/analyticsService";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const analytics = await getAllAnalyticsService();
    return res.json(analytics);
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch analytics",
    });
  }
});

router.get("/driver/:driverId", async (req, res) => {
  try {
    const analytics = await getAnalyticsByDriverIdService(req.params.driverId);
    return res.json(analytics);
  } catch (error) {
    console.error("Failed to fetch driver analytics:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch driver analytics",
    });
  }
});

export default router;
