import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  real,
} from "drizzle-orm/pg-core";

export const drivers = pgTable("drivers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phone: text("phone"),
  ratingAverage: real("rating_average").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
