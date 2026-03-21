import { describe, expect, it } from "vitest";

describe("worker basics", () => {
  it("can check a simple chained job object", () => {
    const nextJob = {
      jobType: "delayAlertChain",
      priority: 3,
    };

    expect(nextJob.jobType).toBe("delayAlertChain");
    expect(nextJob.priority).toBe(3);
  });
});
