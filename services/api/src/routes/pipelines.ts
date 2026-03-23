import { Router } from "express";
import { AppError } from "../../../../types";
import {
  createPipelineService,
  deletePipelineByIdService,
  getAllPipelinesService,
  getPipelineByIdService,
  updatePipelineByIdService,
} from "../services/pipelineService";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const pipeline = await createPipelineService(req.body);
    return res.status(201).json(pipeline);
  } catch (error) {
    console.error("Failed to create pipeline:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to create pipeline",
    });
  }
});

router.get("/", async (_req, res) => {
  try {
    const pipelines = await getAllPipelinesService();
    return res.json(pipelines);
  } catch (error) {
    console.error("Failed to fetch pipelines:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch pipelines",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pipeline = await getPipelineByIdService(req.params.id);
    return res.json(pipeline);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        code: error.code,
        message: error.message,
      });
    }

    console.error("Failed to fetch pipeline:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch pipeline",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const pipeline = await updatePipelineByIdService(req.params.id, req.body);
    return res.json(pipeline);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        code: error.code,
        message: error.message,
      });
    }

    console.error("Failed to update pipeline:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to update pipeline",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deletePipelineByIdService(req.params.id);
    return res.json(deleted);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        code: error.code,
        message: error.message,
      });
    }

    console.error("Failed to delete pipeline:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to delete pipeline",
    });
  }
});

export default router;