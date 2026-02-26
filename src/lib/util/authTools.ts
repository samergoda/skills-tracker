import "server-only";
import jwt from "jsonwebtoken";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import "dotenv/config";

const SECRET = process.env.SECRET;

if (!SECRET) {
  throw new Error("SECRET is not defined in environment variables");
}

export const createTokenForUser = (userId: string, rule: string) => {
  const token = jwt.sign({ id: userId, rule }, SECRET);
  return token;
};

export const getUserFromToken = async (token: string) => {
  const payload = jwt.verify(token, SECRET) as { id: string };

  const user = await db.query.users.findFirst({
    where: eq(users.id, payload.id),
    columns: {
      id: true,
      email: true,
      createdAt: true,
      rule: true,
    },
  });

  return user;
};

export const hashPW = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePW = (password: string, hashedPW: string) => {
  return bcrypt.compare(password, hashedPW);
};
