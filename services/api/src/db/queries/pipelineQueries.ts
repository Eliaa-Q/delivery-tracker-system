import { db } from "../db";
import { pipelines } from "../schema/pipelines";
import { eq } from "drizzle-orm";

export async function createPipeline(data: any) {
  return db.insert(pipelines).values(data);
}

export async function getPipelineById(id: string) {
  return db.select().from(pipelines).where(eq(pipelines.id, id));
}
