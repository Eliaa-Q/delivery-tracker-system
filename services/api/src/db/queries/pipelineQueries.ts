import { eq } from "drizzle-orm";
import { db } from "../db";
import { pipelines } from "../schema/pipelines";

export async function createPipeline(data: typeof pipelines.$inferInsert) {
  const result = await db.insert(pipelines).values(data).returning();
  return result[0];
}

export async function getAllPipelines() {
  return db.select().from(pipelines);
}

export async function getPipelineById(id: string) {
  const result = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.id, id))
    .limit(1);

  return result[0];
}

export async function getPipelineBySourcePath(sourcePath: string) {
  const result = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.sourcePath, sourcePath))
    .limit(1);

  return result[0];
}

export async function deletePipelineById(id: string) {
  const result = await db
    .delete(pipelines)
    .where(eq(pipelines.id, id))
    .returning();

  return result[0];
}
