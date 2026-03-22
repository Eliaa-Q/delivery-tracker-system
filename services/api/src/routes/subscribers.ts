import { Router } from "express";
import { AppError } from "../../../../types";
import {
  createSubscriberService,
  deleteSubscriberByIdService,
  getSubscribersByPipelineIdService,
} from "../services/subscriberService";

const router = Router();

router.post("/pipelines/:id/subscribers", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, targetUrl } = req.body;

    if (!name || !targetUrl) {
      return res.status(400).json({
        code: "INVALID_PAYLOAD",
        message: "name and targetUrl are required",
      });
    }

    const subscriber = await createSubscriberService({
      pipelineId: id,
      name,
      targetUrl,
    });

    return res.status(201).json(subscriber);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        code: error.code,
        message: error.message,
        details: error.details,
      });
    }

    console.error("Failed to create subscriber:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to create subscriber",
    });
  }
});

router.get("/pipelines/:id/subscribers", async (req, res) => {
  try {
    const subscribers = await getSubscribersByPipelineIdService(req.params.id);
    return res.json(subscribers);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        code: error.code,
        message: error.message,
        details: error.details,
      });
    }

    console.error("Failed to fetch subscribers:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch subscribers",
    });
  }
});

router.delete("/subscribers/:id", async (req, res) => {
  try {
    const deleted = await deleteSubscriberByIdService(req.params.id);
    return res.json(deleted);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        code: error.code,
        message: error.message,
        details: error.details,
      });
    }

    console.error("Failed to delete subscriber:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to delete subscriber",
    });
  }
});

export default router;
