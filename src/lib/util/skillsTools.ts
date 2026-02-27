import "server-only";
import { db } from "@/db/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export async function findSkillsByUserId(userId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`skills-user-${userId}`);
  cacheTag("skills-user");
  return db.query.skills.findMany({
    where: eq(skills.ownerId, userId),
  });
}

export async function findAllSkills() {
  "use cache";
  cacheLife("hours");
  cacheTag("skills-user");
  cacheTag("skills-all");

  return db.query.skills.findMany();
}
