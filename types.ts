//Job Types
export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface Job {
  id: string;
  pipelineId: string;
  status: JobStatus;
  payload: unknown;
  result?: unknown;
  createdAt: Date;
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
  actionType: PipelineAction;
  actionConfig: Record<string, unknown>;
}

//Delivery Types
export type DeliveryStatus =
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "delayed"
  | "canceled"
  | "exception";

export interface DeliveryRecord {
  id: string;
  driverId: string;
  status: DeliveryStatus;
  eta?: number;
}

//Event Types
export type DeliveryEventType =
  | "status_changed"
  | "delay_detected"
  | "feedback_received"
  | "alert_triggered";
