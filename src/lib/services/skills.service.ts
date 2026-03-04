import "server-only";

import { skills } from "@/db/schema";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { getUserFromToken } from "../util/authTools";
import { findAllSkills, findSkillsByUserId } from "../util/skillsTools";
import { revalidatePath, revalidateTag } from "next/cache";

export const skillRepository = {
  async findByUser() {
    const user = await getUserFromToken();

    // Get all data if admin
    if (user.rule === "admin") {
      const result = await findAllSkills();
      return result;
    }

    // Get only user's data
    const result = await findSkillsByUserId(user.id);
    return result;
  },

  async create(data: Pick<Skill, "name" | "category" | "difficulty">) {
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



  },

  async update(id: string, data: Pick<Skill, "name" | "category" | "difficulty">) {
    await db
      .update(skills)
      .set({
        name: data.name,
        category: data.category,
        difficulty: data.difficulty,
      })
      .where(eq(skills.id, id));
  },

  async delete(id: string) {
    await db.delete(skills).where(eq(skills.id, id));
  },
};
