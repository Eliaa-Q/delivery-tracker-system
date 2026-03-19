import { db } from "../db";
import { deliveryEvents } from "../schema/deliveryEvents";
import { eq } from "drizzle-orm";

export async function createDeliveryEvent(
  data: typeof deliveryEvents.$inferInsert,
) {
  const result = await db.insert(deliveryEvents).values(data).returning();
  return result[0];
}

export async function getEventsByDeliveryId(deliveryId: string) {
  return db
    .select()
    .from(deliveryEvents)
    .where(eq(deliveryEvents.deliveryId, deliveryId));
}
