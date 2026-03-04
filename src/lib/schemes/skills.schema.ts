import { z } from "zod";
// Schema for skill from rest api
export const RestSkillSchema = z.object({
  id: z.string(),
  skill: z.string(),
  logo: z.string(),
  category: z.string(),
  createdAt: z.string(),
});

// Schema for skill from DB
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  difficulty: z.string(),
  is_public: z.string(),
  createdAt: z.string(),
  ownerId: z.string(),
});

export const RestSkillsSchema = z.array(RestSkillSchema);
export const SkillsSchema = z.array(SkillSchema);

