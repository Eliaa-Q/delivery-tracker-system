import { eq } from "drizzle-orm";
import { db } from "../db";
import { deliveries } from "../schema/deliveries";

export async function getDeliveryById(id: string) {
  const result = await db
    .select()
    .from(deliveries)
    .where(eq(deliveries.id, id))
    .limit(1);

  return result[0];
}

export async function createDelivery(data: typeof deliveries.$inferInsert) {
  const result = await db.insert(deliveries).values(data).returning();
  return result[0];
}

export async function updateDeliveryById(
  id: string,
  data: Partial<typeof deliveries.$inferInsert>,
) {
  const result = await db
    .update(deliveries)
    .set(data)
    .where(eq(deliveries.id, id))
    .returning();

  return result[0];
}

export async function getAllDeliveries() {
  return db.select().from(deliveries);
}
