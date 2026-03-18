import { db } from "../db";
import { pipelines } from "../schema/pipelines";
import { eq } from "drizzle-orm";

export async function createPipeline(data: typeof pipelines.$inferInsert) {
  return db.insert(pipelines).values(data).returning();
}

export async function getPipelineBySourcePath(sourcePath: string) {
  const result = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.sourcePath, sourcePath))
    .limit(1);

  return result[0];
}

export async function getPipelineById(id: string) {
  const result = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.id, id))
    .limit(1);

  return result[0];
}
