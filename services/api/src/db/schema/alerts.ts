import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { deliveries } from "./deliveries";
import { drivers } from "./drivers";
import { jobs } from "./jobs";

export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),

  deliveryId: uuid("delivery_id").references(() => deliveries.id),

  driverId: uuid("driver_id").references(() => drivers.id),

  type: text("type").notNull(),

  message: text("message").notNull(),

  sourceJobId: uuid("source_job_id").references(() => jobs.id),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
