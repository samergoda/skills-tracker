import "server-only";

import { skills } from "@/db/schema";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { getUserFromToken } from "../util/authTools";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { getToken } from "../util/getToken";
import { findAllSkills, findSkillsByUserId } from "../util/skillsTools";
import { revalidateTag } from "next/cache";

export const skillRepository = {
  async findByUser() {
    const user = await getUserFromToken();

    // Get all data if admin
    if (user.rule === "admin") {
      const result = await findAllSkills();
      return result;
    }

    // Get only user's data if
    const result = await findSkillsByUserId(user.id);

    return result;
  },

  async create(data: { name: string; category: string; difficulty: string }) {
    const user = await getUserFromToken();

    const skillId = crypto.randomUUID();
    await db.insert(skills).values({
      id: skillId,
      ownerId: user.id,
      name: data.name,
      category: data.category,
      difficulty: data.difficulty,
      is_public: "1",
    });

    // Revalidate with correct single-argument syntax
    revalidateTag(`skills-user-${user.id}`, "max");
  },

  async update(id: string, data: { name: string; category: string; difficulty: string }) {
    const user = await getUserFromToken();

    await db
      .update(skills)
      .set({
        name: data.name,
        category: data.category,
        difficulty: data.difficulty,
      })
      .where(eq(skills.id, id));

    // Revalidate caches after successful update
    revalidateTag(`skills-user-${user.id}`, "max");
    revalidateTag("skills-all", "max");
  },
};
