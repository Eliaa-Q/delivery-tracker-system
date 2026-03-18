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

  attemptCount: integer("attempt_count").notNull().default(0),

  maxAttempts: integer("max_attempts").notNull().default(3),

  errorMessage: text("error_message"),

  lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),

  lockedAt: timestamp("locked_at", { withTimezone: true }),
});
