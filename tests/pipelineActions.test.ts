import { describe, expect, it } from "vitest";
import { detectDelay } from "../services/api/src/actions/detectDelay";
import { updateDeliveryStatus } from "../services/api/src/actions/updateDeliveryStatus";

describe("pipeline actions", () => {
  it("updateDeliveryStatus throws when payload is missing", async () => {
    await expect(
      updateDeliveryStatus({
        id: "1",
        pipelineId: "p1",
        jobType: "updateDeliveryStatus",
        status: "pending",
        priority: 1,
        attemptCount: 0,
        maxAttempts: 3,
        createdAt: new Date(),
      } as any),
    ).rejects.toThrow("Job payload must be an object");
  });

  it("detectDelay throws when payload is missing", async () => {
    await expect(
      detectDelay({
        id: "2",
        pipelineId: "p2",
        jobType: "detectDelay",
        status: "pending",
        priority: 1,
        attemptCount: 0,
        maxAttempts: 3,
        createdAt: new Date(),
      } as any),
    ).rejects.toThrow("Job payload must be an object");
  });
});
