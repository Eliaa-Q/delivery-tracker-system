import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { pipelines } from "./pipelines";

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),

  pipelineId: uuid("pipeline_id")
    .references(() => pipelines.id)
    .notNull(),

  name: text("name").notNull(),

  targetUrl: text("target_url").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
