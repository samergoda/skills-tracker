import "server-only";

import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { CustomError } from "../util/customError";
import { hashPW } from "../util/authTools";

export const getAllUsers = async () => {
  const users = await db.query.users.findMany();
  return users;
};

export const getUser = async (email: string) => {
  const match = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!match) {
    throw new CustomError("INVALID_CREDENTIALS");
  }
  return match;
};

export const updateUser = async (id: string, data: Pick<User, "firstName" | "lastName" | "email"> & { password: string }) => {
  const { email, firstName, lastName, password } = data;
  const hashedPW = await hashPW(password);
  const rows = await db.update(users).set({ email, firstName, lastName, password: hashedPW }).where(eq(users.id, id)).returning({
    id: users.id,
    email: users.email,
    createdAt: users.createdAt,
    rule: users.rule,
    firstName: users.firstName,
    lastName: users.lastName,
  });
  return rows[0];
};

export const updateUserRule = async (id: string, rule: "admin" | "user") => {
  const rows = await db.update(users).set({ rule }).where(eq(users.id, id)).returning({
    id: users.id,
    email: users.email,
    createdAt: users.createdAt,
    rule: users.rule,
    firstName: users.firstName,
    lastName: users.lastName,
  });
  return rows[0];
};
