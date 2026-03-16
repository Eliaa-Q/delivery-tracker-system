import { db } from "../db";
import { deliveryEvents } from "../schema/deliveryEvents";

export async function recordEvent(data: any) {
  return db.insert(deliveryEvents).values(data);
}
