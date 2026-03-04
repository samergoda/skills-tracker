import "server-only";
import { db } from "@/db/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function findSkillsByUserId(userId: string) {
  return db.query.skills.findMany({
    where: eq(skills.ownerId, userId),
  });
}

export async function findAllSkills() {
  return db.query.skills.findMany();
}
