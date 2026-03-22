import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { alerts } from "../schema/alerts";

export async function createAlert(data: typeof alerts.$inferInsert) {
  const result = await db.insert(alerts).values(data).returning();
  return result[0];
}

export async function getAllAlerts() {
  return db.select().from(alerts).orderBy(desc(alerts.createdAt));
}

export async function getAlertsByDeliveryId(deliveryId: string) {
  return db
    .select()
    .from(alerts)
    .where(eq(alerts.deliveryId, deliveryId))
    .orderBy(desc(alerts.createdAt));
}

export async function getAlertsByDriverId(driverId: string) {
  return db
    .select()
    .from(alerts)
    .where(eq(alerts.driverId, driverId))
    .orderBy(desc(alerts.createdAt));
}
