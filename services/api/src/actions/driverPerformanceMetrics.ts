import { ActionResult, AppError, Job } from "../../../../types";
import { getDeliveryById } from "../db/queries/deliveryQueries";
import { createManyAnalyticsRecords } from "../db/queries/analyticsQueries";
import { getDriverFeedbackStats } from "../db/queries/feedbackQueries";
import {
  getDriverById,
  updateDriverRatingAverage,
} from "../db/queries/driverQueries";

type DriverPerformancePayload = {
  driverId?: string;
  driver_id?: string;
  deliveryId?: string;
  delivery_id?: string;
};

function getPayload(job: Job): DriverPerformancePayload {
  if (!job.payload || typeof job.payload !== "object") {
    throw new AppError("INVALID_PAYLOAD", "Job payload must be an object", 400);
  }

  return job.payload as DriverPerformancePayload;
}

export async function driverPerformanceMetrics(
  job: Job,
): Promise<ActionResult> {
  const payload = getPayload(job);

  let driverId = payload.driverId ?? payload.driver_id ?? null;
  const deliveryId = payload.deliveryId ?? payload.delivery_id ?? null;

  if (!driverId && deliveryId) {
    const delivery = await getDeliveryById(deliveryId);

    if (!delivery) {
      throw new AppError(
        "JOB_PROCESSING_FAILED",
        `Delivery ${deliveryId} not found`,
        404,
      );
    }

    driverId = delivery.driverId ?? null;
  }

  if (!driverId) {
    throw new AppError(
      "INVALID_PAYLOAD",
      "driverId or deliveryId is required to calculate driver metrics",
      400,
    );
  }

  const driver = await getDriverById(driverId);

  if (!driver) {
    throw new AppError(
      "JOB_PROCESSING_FAILED",
      `Driver ${driverId} not found`,
      404,
    );
  }

  const stats = await getDriverFeedbackStats(driverId);

  const averageRating =
    stats?.averageRating !== null && stats?.averageRating !== undefined
      ? Number(stats.averageRating)
      : 0;

  const feedbackCount =
    stats?.feedbackCount !== null && stats?.feedbackCount !== undefined
      ? Number(stats.feedbackCount)
      : 0;

  const updatedDriver = await updateDriverRatingAverage(
    driverId,
    averageRating,
  );

  const savedMetrics = await createManyAnalyticsRecords([
    {
      driverId,
      metric: "average_rating",
      value: averageRating,
    },
    {
      driverId,
      metric: "feedback_count",
      value: feedbackCount,
    },
  ]);

  if (feedbackCount > 0 && averageRating < 3.5) {
    return {
      action: "driverPerformanceMetrics",
      success: true,
      driverId,
      averageRating,
      feedbackCount,
      driver: updatedDriver,
      analytics: savedMetrics,
      nextJob: {
        jobType: "driverDelaySpikeChain",
        priority: 3,
        payload: {
          driverId,
          averageRating,
          feedbackCount,
          reason: "Driver average rating dropped below 3.5",
        },
        maxAttempts: 3,
      },
    };
  }

  return {
    action: "driverPerformanceMetrics",
    success: true,
    driverId,
    averageRating,
    feedbackCount,
    driver: updatedDriver,
    analytics: savedMetrics,
  };
}
