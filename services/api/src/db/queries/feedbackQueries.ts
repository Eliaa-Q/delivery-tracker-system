import { db } from "../db";
import { analytics } from "../schema/analytics";
import { eq, desc, sql } from "drizzle-orm";
import { feedback } from "../schema/feedback";
import { deliveries } from "../schema/deliveries";
export async function createAnalyticsRecord(
  data: typeof analytics.$inferInsert,
) {
  const result = await db.insert(analytics).values(data).returning();
  return result[0];
}

export async function createManyAnalyticsRecords(
  data: (typeof analytics.$inferInsert)[],
) {
  return db.insert(analytics).values(data).returning();
}

export async function getAllAnalytics() {
  return db.select().from(analytics).orderBy(desc(analytics.createdAt));
}

export async function getAnalyticsByDriverId(driverId: string) {
  return db
    .select()
    .from(analytics)
    .where(eq(analytics.driverId, driverId))
    .orderBy(desc(analytics.createdAt));
}

export async function createFeedback(data: typeof feedback.$inferInsert) {
  const result = await db.insert(feedback).values(data).returning();
  return result[0];
}

export async function getFeedbackByDeliveryId(deliveryId: string) {
  return db
    .select()
    .from(feedback)
    .where(eq(feedback.deliveryId, deliveryId))
    .orderBy(desc(feedback.createdAt));
}

export async function getAllFeedback() {
  return db.select().from(feedback).orderBy(desc(feedback.createdAt));
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
