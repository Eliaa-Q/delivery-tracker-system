//Job Types
export type JobStatus = "pending" | "processing" | "completed" | "failed";
export interface Job {
  id: string;
  pipelineId: string;
  deliveryId?: string | null;
  jobType: PipelineAction;
  status: JobStatus;
  priority: number;
  payload?: unknown;
  result?: unknown;
  attemptCount: number;
  maxAttempts: number;
  errorMessage?: string | null;
  lastAttemptAt?: Date | null;
  createdAt: Date;
  lockedAt?: Date | null;
}
//Pipeline Types
export type PipelineAction =
  | "updateDeliveryStatus"
  | "detectDelay"
  | "driverPerformanceMetrics"
  | "feedbackIntegration"
  | "delayAlertChain"
  | "driverDelaySpikeChain";

export interface Pipeline {
  id: string;
  name: string;
  sourcePath: string;
  actionType: PipelineAction;
  actionConfig: Record<string, unknown> | null;
  createdAt?: Date;
}
//Delivery Types
export type DeliveryStatus =
  | "new"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "delayed"
  | "canceled"
  | "exception";

export interface DeliveryRecord {
  id: string;
  driverId?: string | null;
  status: DeliveryStatus;
  eta?: Date | null;
}

//Event Types
export type DeliveryEventType =
  | "status_changed"
  | "delay_detected"
  | "feedback_received"
  | "delivery_canceled";

//Action Types
export type ChainedJobRequest = {
  jobType: PipelineAction;
  priority: number;
  payload: Record<string, unknown>;
  deliveryId?: string | null;
  maxAttempts?: number;
};

export type ActionResult = {
  action: PipelineAction;
  success?: boolean;
  nextJob?: ChainedJobRequest;
  [key: string]: unknown;
};

// Error Types
export type AppErrorCode =
  | "PIPELINE_NOT_FOUND"
  | "JOB_NOT_FOUND"
  | "INVALID_PAYLOAD"
  | "DATABASE_ERROR"
  | "JOB_LOCKED"
  | "JOB_PROCESSING_FAILED"
  | "UNKNOWN_ERROR";

export interface AppErrorShape {
  code: AppErrorCode;
  message: string;
  details?: unknown;
}

export class AppError extends Error {
  code: AppErrorCode;
  details?: unknown;
  statusCode: number;

  constructor(
    code: AppErrorCode,
    message: string,
    statusCode = 500,
    details?: unknown,
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
