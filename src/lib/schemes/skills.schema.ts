import { z } from "zod";

export const SkillSchema = z.object({
  id: z.string(),
  skill: z.string(),
  logo: z.string(),
  category: z.string(),
  createdAt: z.string(),
});

export const SkillsSchema = z.array(SkillSchema);
