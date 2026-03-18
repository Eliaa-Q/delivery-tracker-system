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
