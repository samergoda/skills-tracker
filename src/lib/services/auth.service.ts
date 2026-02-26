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

  const token = createTokenForUser(match.id, match.rule);
  const { password: pw, ...user } = match;
  return { user, token };
};

export const signup = async ({ email, password }: { email: string; password: string }) => {
  const hashedPW = await hashPW(password);
  const rows = await db.insert(users).values({ email, password: hashedPW, rule: "user" }).returning({
    id: users.id,
    email: users.email,
    createdAt: users.createdAt,
    rule: users.rule,
  });

  const user = rows[0];
  const token = createTokenForUser(user.id, user.rule);

  return { user, token };
};
