"use server";
import { statsRepository } from "../services/stats.service";

export async function getStats() {
  const stats: Stats[] = await statsRepository.findByUser();
  return stats;
}

export async function createState(data: Pick<Stats, "skillId" | "hours" | "note" | "completionPercent">) {
  return await statsRepository.create(data);
}

export async function deleteState(id: string) {
  return await statsRepository.delete(id);
}
