import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { pipelines } from "./pipelines";
import { deliveries } from "./deliveries";

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),

  pipelineId: uuid("pipeline_id")
    .references(() => pipelines.id)
    .notNull(),

  deliveryId: uuid("delivery_id").references(() => deliveries.id),

  jobType: text("job_type").notNull(),

  status: text("status").notNull(),

  priority: integer("priority").notNull().default(1),

  payload: jsonb("payload"),

  result: jsonb("result"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),

  lockedAt: timestamp("locked_at", { withTimezone: true }),
});
