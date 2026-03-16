import { db } from "../db";
import { deliveries } from "../schema/deliveries";
import { eq } from "drizzle-orm";

export async function getDelivery(id: string) {
  return db.select().from(deliveries).where(eq(deliveries.id, id));
}

export async function updateDeliveryStatus(id: string, status: string) {
  return db.update(deliveries).set({ status }).where(eq(deliveries.id, id));
}
