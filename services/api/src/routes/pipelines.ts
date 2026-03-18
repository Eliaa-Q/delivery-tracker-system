import { Router } from "express";
import {
  createPipelineService,
  deletePipelineByIdService,
  getAllPipelinesService,
  getPipelineByIdService,
} from "../services/pipelineService";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, sourcePath, actionType, actionConfig } = req.body;

    if (!name || !sourcePath || !actionType) {
      return res.status(400).json({
        error: "name, sourcePath, and actionType are required",
      });
    }

    const pipeline = await createPipelineService({
      name,
      sourcePath,
      actionType,
      actionConfig,
    });

    return res.status(201).json(pipeline);
  } catch (error) {
    console.error("Failed to create pipeline:", error);
    return res.status(500).json({ error: "Failed to create pipeline" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const pipelines = await getAllPipelinesService();
    return res.json(pipelines);
  } catch (error) {
    console.error("Failed to fetch pipelines:", error);
    return res.status(500).json({ error: "Failed to fetch pipelines" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pipeline = await getPipelineByIdService(req.params.id);

    if (!pipeline) {
      return res.status(404).json({ error: "Pipeline not found" });
    }

    return res.json(pipeline);
  } catch (error) {
    console.error("Failed to fetch pipeline:", error);
    return res.status(500).json({ error: "Failed to fetch pipeline" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deletePipelineByIdService(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Pipeline not found" });
    }

    return res
      .status(200)
      .json({ message: "Pipeline deleted", pipeline: deleted });
  } catch (error) {
    console.error("Failed to delete pipeline:", error);
    return res.status(500).json({ error: "Failed to delete pipeline" });
  }
});

export default router;
