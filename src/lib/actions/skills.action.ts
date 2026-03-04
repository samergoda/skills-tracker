"use server";

import { revalidatePath, revalidateTag, updateTag } from "next/cache";
import { skillRepository } from "../services/skills.service";
import { SkillsSchema } from "../schemes/skills.schema";
import { getUserFromToken } from "../util/authTools";

export async function createSkill(data: Pick<Skill, "name" | "category" | "difficulty">) {
  await getUserFromToken();
  await skillRepository.create(data);
  updateTag('skills')
  return { success: true };
}

export async function updateSkill(id: string, data: Pick<Skill, "name" | "category" | "difficulty">) {
  await skillRepository.update(id, data);
  updateTag('skills')
  return { success: true };
}

export async function findByUser() {
  const skills: Skill[] = await skillRepository.findByUser();

  const data = SkillsSchema.parse(skills);

  return data;
}

export async function deleteSkill(id: string) {
  await skillRepository.delete(id);
  // Revalidate caches after successful delete
  //   updateTag('skills')

  return { success: true };
}
