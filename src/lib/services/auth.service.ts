import "server-only";

import { db } from "@/db/db";
import { comparePW, createTokenForUser, hashPW } from "../util/authTools";
import { eq } from "drizzle-orm";
import { sessions, users } from "@/db/schema";
import { CustomError } from "../util/customError";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ user: Omit<User, "password">; token: string }> => {
  const match = await getUser(email);

  const correctPW = await comparePW(password, match.password);

  if (!correctPW) {
    throw new CustomError("INVALID_CREDENTIALS");
  }

  const token = createTokenForUser(match.id, match.rule, match.firstName, match.lastName);

  const { password: _, ...user } = match;

  return { user, token };
};

export const signup = async ({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const hashedPW = await hashPW(password);

  const rows = await db.insert(users).values({ email, password: hashedPW, rule: "user", firstName, lastName }).returning({
    id: users.id,
    email: users.email,
    createdAt: users.createdAt,
    rule: users.rule,
    firstName: users.firstName,
    lastName: users.lastName,
  });

  const user = rows[0];
  const token = createTokenForUser(user.id, user.rule, user.firstName, user.lastName);

  await db.insert(sessions).values({
    id: crypto.randomUUID(),
    userId: user.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  });

  return { user, token };
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
