import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { integer, numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";

const id = () =>
  text("id")
    .primaryKey()
    .$default(() => randomUUID());

const createdAt = () =>
  text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull();

const date = (name: string) => text(name);

const boolean = (field: string) => integer(field, { mode: "boolean" });

export const users = sqliteTable("users", {
  id: id(),
  createdAt: createdAt(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  rule: text("rule").notNull(),
  firstName: text("first-name").notNull(),
  lastName: text("last-name").notNull(),
});

export const skills = sqliteTable("skills", {
  id: id(),
  createdAt: createdAt(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  is_public: numeric("is_public").notNull(),
});

export const stats = sqliteTable("stats", {
  id: id(),
  createdAt: createdAt(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  is_public: boolean("is_public").notNull(),
});
