import { pgTable, uuid, text, real, timestamp } from "drizzle-orm/pg-core";
import { drivers } from "./drivers";

export const analytics = pgTable("analytics", {
  id: uuid("id").primaryKey().defaultRandom(),

  driverId: uuid("driver_id").references(() => drivers.id),

  metric: text("metric").notNull(),

  value: real("value"),

  createdAt: timestamp("created_at").defaultNow(),
});
