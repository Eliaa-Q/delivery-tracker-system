import { Router } from "express";
import { AppError } from "../../../../types";
import { getAllJobsService, getJobByIdService } from "../services/jobService";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const jobs = await getAllJobsService();
    return res.json(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await getJobByIdService(req.params.id);
    return res.json(job);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        code: error.code,
        message: error.message,
        details: error.details,
      });
    }

    console.error("Failed to fetch job:", error);
    return res.status(500).json({ error: "Failed to fetch job" });
  }
});

export default router;
