import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const pipelines = pgTable("pipelines", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: text("name").notNull(),

  actionType: text("action_type").notNull(),

  actionConfig: jsonb("action_config"),

  createdAt: timestamp("created_at").defaultNow(),
});
