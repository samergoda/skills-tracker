import "server-only";

import { db } from "@/db/db";
import { comparePW, createTokenForUser, hashPW } from "../util/authTools";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

export const signin = async ({ email, password }: { email: string; password: string }) => {
  const match = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!match) throw new Error("invalid user");

  const correctPW = await comparePW(password, match.password);

  if (!correctPW) {
    throw new Error("invalid user");
  }

  const token = createTokenForUser(match.id, match.rule, match.firstName, match.lastName);
  const { password: pw, ...user } = match;
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

  return { user, token };
};
