import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { deliveries } from "./deliveries";

export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),

  deliveryId: uuid("delivery_id")
    .references(() => deliveries.id)
    .notNull(),

  rating: integer("rating"),

  comment: text("comment"),

  createdAt: timestamp("created_at").defaultNow(),
});
