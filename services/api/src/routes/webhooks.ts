import { Router } from "express";
import { AppError } from "../../../../types";
import { createJobFromWebhook } from "../services/jobService";

const router = Router();

router.post("/:sourcePath", async (req, res) => {
  try {
    const { sourcePath } = req.params;
    const payload = req.body;

    const { pipeline, job } = await createJobFromWebhook(sourcePath, payload);

    return res.status(202).json({
      message: "Webhook accepted and queued",
      pipeline: {
        id: pipeline.id,
        name: pipeline.name,
        sourcePath: pipeline.sourcePath,
        actionType: pipeline.actionType,
      },
      job,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        code: error.code,
        message: error.message,
        details: error.details,
      });
    }

    console.error("Failed to queue webhook job:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to queue webhook job",
    });
  }
});

export default router;
