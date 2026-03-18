import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { db } from "../db";
import { jobs } from "../schema/jobs";

export async function createJob(data: typeof jobs.$inferInsert) {
  const result = await db.insert(jobs).values(data).returning();
  return result[0];
}

export async function getAllJobs() {
  return db.select().from(jobs).orderBy(desc(jobs.createdAt));
}

export async function getJobById(id: string) {
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);

  return result[0];
}

export async function getNextPendingJob() {
  const result = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.status, "pending"), isNull(jobs.lockedAt)))
    .orderBy(desc(jobs.priority), asc(jobs.createdAt))
    .limit(1);

  return result[0];
}

export async function lockJob(id: string) {
  const result = await db
    .update(jobs)
    .set({
      status: "processing",
      lockedAt: new Date(),
      lastAttemptAt: new Date(),
    })
    .where(eq(jobs.id, id))
    .returning();

  return result[0];
}

export async function completeJob(id: string, resultData: unknown) {
  const result = await db
    .update(jobs)
    .set({
      status: "completed",
      result: resultData,
      lockedAt: null,
    })
    .where(eq(jobs.id, id))
    .returning();

  return result[0];
}

export async function retryJob(
  id: string,
  attemptCount: number,
  errorMessage: string,
) {
  const result = await db
    .update(jobs)
    .set({
      status: "pending",
      attemptCount,
      errorMessage,
      lockedAt: null,
    })
    .where(eq(jobs.id, id))
    .returning();

  return result[0];
}

export async function failJob(
  id: string,
  attemptCount: number,
  errorMessage: string,
) {
  const result = await db
    .update(jobs)
    .set({
      status: "failed",
      attemptCount,
      errorMessage,
      lockedAt: null,
    })
    .where(eq(jobs.id, id))
    .returning();

  return result[0];
}
