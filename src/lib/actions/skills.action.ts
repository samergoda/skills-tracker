"use server";

import { revalidateTag } from "next/cache";
import { skillRepository } from "../services/skills.service";

export async function createSkill(data: Skill) {
  revalidateTag("skills", "max");
  await skillRepository.create(data);
  return { success: true };
}

export async function updateSkill(id: string, data: Skill) {
  revalidateTag("skills", "max");

  await skillRepository.update(id, data);
  return { success: true };
}

export async function findByUser() {
  const skills: Skill[] = await skillRepository.findByUser();
  return skills;
}

export async function deleteSkill(id: string) {
  revalidateTag("skills", "max");

  await skillRepository.delete(id);
  return { success: true };
}
