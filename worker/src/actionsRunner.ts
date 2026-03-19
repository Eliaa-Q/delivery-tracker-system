import { ActionResult, AppError, Job } from "../../types";
import { delayAlertChain } from "../../services/api/src/actions/delayAlertChain";
import { detectDelay } from "../../services/api/src/actions/detectDelay";
import { driverDelaySpikeChain } from "../../services/api/src/actions/driverDelaySpikeChain";
import { driverPerformanceMetrics } from "../../services/api/src/actions/driverPerformanceMetrics";
import { feedbackIntegration } from "../../services/api/src/actions/feedbackIntegration";
import { updateDeliveryStatus } from "../../services/api/src/actions/updateDeliveryStatus";

export async function runAction(job: Job): Promise<ActionResult> {
  switch (job.jobType) {
    case "updateDeliveryStatus":
      return updateDeliveryStatus(job);

    case "detectDelay":
      return detectDelay(job);

    case "driverPerformanceMetrics":
      return driverPerformanceMetrics(job);

    case "feedbackIntegration":
      return feedbackIntegration(job);

    case "delayAlertChain":
      return delayAlertChain(job);

    case "driverDelaySpikeChain":
      return driverDelaySpikeChain(job);

    default:
      throw new AppError(
        "JOB_PROCESSING_FAILED",
        `Unsupported job type: ${job.jobType}`,
        500,
      );
  }
}
