import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { deliveries } from "../schema/deliveries";
import { feedback } from "../schema/feedback";

export async function createFeedback(data: typeof feedback.$inferInsert) {
  const result = await db.insert(feedback).values(data).returning();
  return result[0];
}

export async function getFeedbackByDeliveryId(deliveryId: string) {
  return db.select().from(feedback).where(eq(feedback.deliveryId, deliveryId));
}

export async function getDriverFeedbackStats(driverId: string) {
  const result = await db
    .select({
      averageRating: sql<number>`avg(${feedback.rating})`,
      feedbackCount: sql<number>`count(${feedback.id})`,
    })
    .from(feedback)
    .innerJoin(deliveries, eq(feedback.deliveryId, deliveries.id))
    .where(eq(deliveries.driverId, driverId));

  return result[0];
}
