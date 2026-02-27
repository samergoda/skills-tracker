"use server";

import { revalidateTag, updateTag } from "next/cache";
import { skillRepository } from "../services/skills.service";

export async function createSkill(data: { name: string; category: string; difficulty: string }) {
  revalidateTag("skills", "max");
  updateTag("skills-user");
  await skillRepository.create(data);
  return { success: true };
}

export async function updateSkill(id: string, data: { name: string; category: string; difficulty: string }) {
  revalidateTag("skills", "max");
  updateTag("skills-user");

  await skillRepository.update(id, data);
  return { success: true };
}

export async function findByUser() {
  return await skillRepository.findByUser();
}
