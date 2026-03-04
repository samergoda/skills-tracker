import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { integer, numeric, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
  rule: text("rule", { enum: ["admin", "user"] })
    .notNull()
    .$default(() => "user"),
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

export const progressEntries = sqliteTable("progress_entries", {
  id: id(),
  createdAt: createdAt(),
  userId: text("user_id").notNull(),
  skillId: text("skill_id").notNull(),
  hours: real("hours").notNull(),
  note: text("note").notNull(),
  completionPercent: real("completion_percent").notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: id(),
  userId: text("user_id").notNull(),
  expiresAt: text("expires_at").notNull(),
});
