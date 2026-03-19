import { eq } from "drizzle-orm";
import { db } from "../db";
import { drivers } from "../schema/drivers";

export async function createDriver(data: typeof drivers.$inferInsert) {
  const result = await db.insert(drivers).values(data).returning();
  return result[0];
}

export async function createManyDrivers(data: (typeof drivers.$inferInsert)[]) {
  return db.insert(drivers).values(data).returning();
}

export async function getAllDrivers() {
  return db.select().from(drivers);
}

export async function getDriverById(id: string) {
  const result = await db
    .select()
    .from(drivers)
    .where(eq(drivers.id, id))
    .limit(1);

  return result[0];
}

export async function updateDriverRatingAverage(
  id: string,
  ratingAverage: number,
) {
  const result = await db
    .update(drivers)
    .set({ ratingAverage })
    .where(eq(drivers.id, id))
    .returning();

  return result[0];
}
