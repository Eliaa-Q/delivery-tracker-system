import { Router } from "express";
import { AppError } from "../../../../types";
import {
  getAllDeliveriesService,
  getDeliveryByIdService,
  getDeliveryEventsService,
} from "../services/deliveryService";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const deliveries = await getAllDeliveriesService();
    return res.json(deliveries);
  } catch (error) {
    console.error("Failed to fetch deliveries:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch deliveries",
    });
  }
});

router.get("/:id/events", async (req, res) => {
  try {
    const events = await getDeliveryEventsService(req.params.id);
    return res.json(events);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        code: error.code,
        message: error.message,
        details: error.details,
      });
    }

    console.error("Failed to fetch delivery events:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch delivery events",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const delivery = await getDeliveryByIdService(req.params.id);
    return res.json(delivery);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        code: error.code,
        message: error.message,
        details: error.details,
      });
    }

    console.error("Failed to fetch delivery:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch delivery",
    });
  }
});

export default router;
