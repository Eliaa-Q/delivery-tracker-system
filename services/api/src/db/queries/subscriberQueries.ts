import { eq } from "drizzle-orm";
import { db } from "../db";
import { subscribers } from "../schema/subscribers";

export async function createSubscriber(data: typeof subscribers.$inferInsert) {
  const result = await db.insert(subscribers).values(data).returning();
  return result[0];
}

export async function getSubscribersByPipelineId(pipelineId: string) {
  return db
    .select()
    .from(subscribers)
    .where(eq(subscribers.pipelineId, pipelineId));
}

export async function getSubscriberById(id: string) {
  const result = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.id, id))
    .limit(1);

  return result[0];
}

export async function deleteSubscriberById(id: string) {
  const result = await db
    .delete(subscribers)
    .where(eq(subscribers.id, id))
    .returning();

  return result[0];
}
