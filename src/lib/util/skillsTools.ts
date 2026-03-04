import "server-only";
import { db } from "@/db/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";

export async function findSkillsByUserId(userId: string) {
  'use cache'
  cacheTag('skills')
  return db.query.skills.findMany({
    where: eq(skills.ownerId, userId),
  });
}

export async function findAllSkills() {
  'use cache'
  cacheTag('skills')

  return db.query.skills.findMany();
}
