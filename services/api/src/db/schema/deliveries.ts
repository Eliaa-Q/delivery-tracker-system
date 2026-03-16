import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { drivers } from "./drivers";

export const deliveries = pgTable("deliveries", {
  id: uuid("id").primaryKey().defaultRandom(),

  driverId: uuid("driver_id").references(() => drivers.id),

  status: text("status").notNull(),

  eta: timestamp("eta"),

  createdAt: timestamp("created_at").defaultNow(),
});
