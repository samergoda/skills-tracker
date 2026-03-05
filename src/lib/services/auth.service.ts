import "server-only";

import { db } from "@/db/db";
import { comparePW, createTokenForUser, hashPW } from "../util/authTools";
import { sessions, users } from "@/db/schema";
import { CustomError } from "../util/customError";
import { getUser } from "./user.service";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ user: Omit<User, "password">; token: string }> => {
  const match = await getUser(email);
  // console.log("matchhh", match);
  const correctPW = await comparePW(password, match.password);
  console.log("correctPW", correctPW);
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
