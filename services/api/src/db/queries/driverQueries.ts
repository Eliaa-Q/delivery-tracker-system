import { db } from "../db";
import { drivers } from "../schema/drivers";

export async function getDrivers() {
  return db.select().from(drivers);
}

export async function createDriver(data: any) {
  return db.insert(drivers).values(data);
}
