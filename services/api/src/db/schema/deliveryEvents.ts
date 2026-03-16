import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { deliveries } from "./deliveries";

export const deliveryEvents = pgTable("delivery_events", {
  id: uuid("id").primaryKey().defaultRandom(),

  deliveryId: uuid("delivery_id")
    .references(() => deliveries.id)
    .notNull(),

  eventType: text("event_type").notNull(),

  payload: jsonb("payload"),

  createdAt: timestamp("created_at").defaultNow(),
});
