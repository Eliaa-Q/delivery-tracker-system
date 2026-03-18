import { db } from "../db";
import { jobs } from "../schema/jobs";
import { eq, desc, and, isNull } from "drizzle-orm";

export async function createJob(data: typeof jobs.$inferInsert) {
  const result = await db.insert(jobs).values(data).returning();
  return result[0];
}
export async function getNextJob() {
  const result = await db
    .select()
    .from(jobs)
    //no two workers will work on the dame job
    .where(and(eq(jobs.status, "pending"), isNull(jobs.lockedAt)))
    .orderBy(desc(jobs.priority), jobs.createdAt)
    .limit(1);

  return result[0];
}
export async function getPendingJobs() {
  return db.select().from(jobs).where(eq(jobs.status, "pending"));
}

export async function lockJob(id: string) {
  return db
    .update(jobs)
    .set({ lockedAt: new Date(), status: "processing" })
    .where(eq(jobs.id, id));
}

export async function completeJob(id: string, result: any) {
  return db
    .update(jobs)
    .set({
      status: "completed",
      result,
    })
    .where(eq(jobs.id, id));
}
export async function getAllJobs() {
  return db.select().from(jobs).orderBy(desc(jobs.createdAt));
}

export async function getJobById(id: string) {
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);

  return result[0];
}
