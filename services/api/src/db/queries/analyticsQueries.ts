import { db } from "../db";
import { analytics } from "../schema/analytics";

export async function recordMetric(data: any) {
  return db.insert(analytics).values(data);
}

export async function getMetrics() {
  return db.select().from(analytics);
}
