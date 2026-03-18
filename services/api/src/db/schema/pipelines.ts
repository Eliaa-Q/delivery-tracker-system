import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const pipelines = pgTable(
  "pipelines",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    name: text("name").notNull(),

    sourcePath: text("source_path").notNull(),

    actionType: text("action_type").notNull(),

    actionConfig: jsonb("action_config"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    sourcePathIdx: uniqueIndex("pipelines_source_path_idx").on(
      table.sourcePath,
    ),
  }),
);
