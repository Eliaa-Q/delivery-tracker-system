import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { deliveryAttempts } from "../schema/deliveryAttempts";

export async function createDeliveryAttempt(
  data: typeof deliveryAttempts.$inferInsert,
) {
  const result = await db.insert(deliveryAttempts).values(data).returning();
  return result[0];
}

export async function getDeliveryAttemptsByJobId(jobId: string) {
  return db
    .select()
    .from(deliveryAttempts)
    .where(eq(deliveryAttempts.jobId, jobId))
    .orderBy(desc(deliveryAttempts.createdAt));
}

export async function markDeliveryAttemptSuccess(
  id: string,
  responseStatus: number,
  responseBody: string | null,
  attemptCount: number,
) {
  const result = await db
    .update(deliveryAttempts)
    .set({
      status: "success",
      responseStatus,
      responseBody,
      attemptCount,
      lastAttemptAt: new Date(),
    })
    .where(eq(deliveryAttempts.id, id))
    .returning();

  return result[0];
}

export async function markDeliveryAttemptFailed(
  id: string,
  responseStatus: number | null,
  responseBody: string | null,
  attemptCount: number,
) {
  const result = await db
    .update(deliveryAttempts)
    .set({
      status: "failed",
      responseStatus,
      responseBody,
      attemptCount,
      lastAttemptAt: new Date(),
    })
    .where(eq(deliveryAttempts.id, id))
    .returning();

  return result[0];
}
