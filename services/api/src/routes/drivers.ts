import { Router } from "express";
import { AppError } from "../../../../types";
import {
  getAllDriversService,
  getDriverByIdService,
} from "../services/driverService";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const drivers = await getAllDriversService();
    return res.json(drivers);
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch drivers",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const driver = await getDriverByIdService(req.params.id);
    return res.json(driver);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        code: error.code,
        message: error.message,
        details: error.details,
      });
    }

    console.error("Failed to fetch driver:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Failed to fetch driver",
    });
  }
});

export default router;
