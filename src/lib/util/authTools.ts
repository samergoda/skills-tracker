import "server-only";

import jwt from "jsonwebtoken";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { sessions, users } from "@/db/schema";
import bcrypt from "bcrypt";
import { getLocale } from "next-intl/server";
import { getToken } from "./getToken";
import { redirect } from "@/i18n/navigation";
import { CustomError } from "./customError";

const SECRET = process.env.SECRET;

if (!SECRET) {
  throw new Error("SECRET is not defined in environment variables");
}

export const createTokenForUser = (userId: string, rule: string, firstName: string, lastName: string) => {
  const token = jwt.sign({ id: userId, rule, firstName, lastName }, SECRET);
  return token;
};

export const getUserFromToken = async () => {
  // Locale
  const locale = await getLocale();

  // Token
  const token = await getToken();

  if (!token) return redirect({ href: "/login", locale });

  const payload = jwt.verify(token, SECRET) as { id: string };

  const user = await db.query.users.findFirst({
    where: eq(users.id, payload.id),
    columns: {
      id: true,
      email: true,
      createdAt: true,
      rule: true,
      firstName: true,
      lastName: true,
    },
  });
  if (!user?.id) return redirect({ href: "/login", locale });

  return user;
};

export const hashPW = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePW = (password: string, hashedPW: string) => {
  return bcrypt.compare(password, hashedPW);
};

export const getSession = async () => {
  const locale = await getLocale();
  const token = await getToken();

  if (!token) {
    return redirect({ href: "/login", locale });
  }

  let payload: { id: string };

  try {
    payload = jwt.verify(token, SECRET) as {
      id: string;
    };
  } catch {
    return redirect({ href: "/login", locale });
  }

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.userId, payload.id),
  });

  if (!session || new Date(session.expiresAt) < new Date()) {
    return redirect({ href: "/login", locale });
  }

  return session;
};

export const createSession = async () => {
  const user = await getUserFromToken();

  const session = await db.insert(sessions).values({
    id: crypto.randomUUID(),
    userId: user.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  });

  return session;
};
