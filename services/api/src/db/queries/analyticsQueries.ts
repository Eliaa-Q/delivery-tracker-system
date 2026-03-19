import { db } from "../db";
import { analytics } from "../schema/analytics";

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
  return db.select().from(analytics);
}
