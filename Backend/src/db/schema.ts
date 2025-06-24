import { integer, pgTable, text, varchar, serial } from "drizzle-orm/pg-core";

// Table to store blog post generation input details
export const postTable = pgTable("post_table", {
  id: serial("id").primaryKey(),
  blogUrl: varchar("blog_url", { length: 255 }).notNull(),
  platform: integer("platform").notNull(),
  tone: varchar("tone", { length: 100 }).notNull(),
});

// Table to store generated content mapped to postTable
export const post = pgTable("post", {
  id: serial("id").primaryKey(),
  postTableId: integer("post_table_id")
    .notNull()
    .references(() => postTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
});
