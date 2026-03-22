import { Router } from "express";
import {
  getAllAlertsService,
  getAlertsByDeliveryIdService,
  getAlertsByDriverIdService,
} from "../services/alertService";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const alerts = await getAllAlertsService();
    return res.json(alerts);
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch alerts",
    });
  }
});

router.get("/delivery/:deliveryId", async (req, res) => {
  try {
    const alerts = await getAlertsByDeliveryIdService(req.params.deliveryId);
    return res.json(alerts);
  } catch (error) {
    console.error("Failed to fetch delivery alerts:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch delivery alerts",
    });
  }
});

router.get("/driver/:driverId", async (req, res) => {
  try {
    const alerts = await getAlertsByDriverIdService(req.params.driverId);
    return res.json(alerts);
  } catch (error) {
    console.error("Failed to fetch driver alerts:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch driver alerts",
    });
  }
});

export default router;
