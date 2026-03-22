//This belongs to the subscribers part of the code
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { jobs } from "./jobs";
import { subscribers } from "./subscribers";

export const deliveryAttempts = pgTable("delivery_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),

  jobId: uuid("job_id")
    .references(() => jobs.id)
    .notNull(),

  subscriberId: uuid("subscriber_id")
    .references(() => subscribers.id)
    .notNull(),

  status: text("status").notNull().default("pending"),

  attemptCount: integer("attempt_count").notNull().default(0),

  responseStatus: integer("response_status"),

  responseBody: text("response_body"),

  lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
