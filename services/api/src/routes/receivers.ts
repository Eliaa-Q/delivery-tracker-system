import { Router } from "express";
import { createAlert } from "../db/queries/alertQueries";
import { createAnalyticsRecord } from "../db/queries/analyticsQueries";
import { getDeliveryById } from "../db/queries/deliveryQueries";

const router = Router();

router.post("/receivers/alerts", async (req, res) => {
  try {
    const body = req.body;

    const result = body?.result ?? {};
    const jobId = body?.jobId ?? null;

    const payload = result?.payload ?? {};
    const delivery = result?.delivery ?? null;
    const driver = result?.driver ?? null;

    const deliveryId =
      payload?.deliveryId ?? result?.deliveryId ?? delivery?.id ?? null;

    let driverId = payload?.driverId ?? result?.driverId ?? driver?.id ?? null;

    if (!driverId && deliveryId) {
      const existingDelivery = await getDeliveryById(deliveryId);
      driverId = existingDelivery?.driverId ?? null;
    }

    let type = "generic_alert";
    let message = "Alert received";

    if (result?.action === "delayAlertChain") {
      type = "delay_alert";
      message =
        result?.message ??
        `Delay alert received for delivery ${deliveryId ?? "unknown"}`;
    }

    if (result?.action === "driverDelaySpikeChain") {
      type = "driver_escalation";
      message =
        result?.reason ??
        result?.message ??
        `Driver escalation received for driver ${driverId ?? "unknown"}`;
    }

    const alert = await createAlert({
      deliveryId,
      driverId,
      type,
      message,
      sourceJobId: jobId,
    });

    return res.status(200).json({
      message: "Alert receiver accepted payload",
      alert,
    });
  } catch (error) {
    console.error("Alerts receiver failed:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Alerts receiver failed",
    });
  }
});

router.post("/receivers/analytics", async (req, res) => {
  try {
    const body = req.body;
    const result = body?.result ?? {};
    const payload = result?.payload ?? {};
    const driver = result?.driver ?? null;

    const driverId =
      result?.driverId ?? payload?.driverId ?? driver?.id ?? null;

    const averageRating =
      result?.averageRating ?? payload?.averageRating ?? null;

    const feedbackCount =
      result?.feedbackCount ?? payload?.feedbackCount ?? null;

    const createdRecords = [];

    if (driverId && averageRating !== null && averageRating !== undefined) {
      const averageRecord = await createAnalyticsRecord({
        driverId,
        metric: "subscriber_average_rating",
        value: Number(averageRating),
      });

      createdRecords.push(averageRecord);
    }

    if (driverId && feedbackCount !== null && feedbackCount !== undefined) {
      const countRecord = await createAnalyticsRecord({
        driverId,
        metric: "subscriber_feedback_count",
        value: Number(feedbackCount),
      });

      createdRecords.push(countRecord);
    }

    return res.status(200).json({
      message: "Analytics receiver accepted payload",
      records: createdRecords,
    });
  } catch (error) {
    console.error("Analytics receiver failed:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Analytics receiver failed",
    });
  }
});

router.post("/receivers/logs", async (req, res) => {
  try {
    console.log("Receiver log payload:", req.body);

    return res.status(200).json({
      message: "Log receiver accepted payload",
    });
  } catch (error) {
    console.error("Logs receiver failed:", error);
    return res.status(500).json({
      code: "UNKNOWN_ERROR",
      message: "Logs receiver failed",
    });
  }
});

export default router;
