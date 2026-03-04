import { CustomError } from "../util/customError";
import { SkillsSchema } from "../schemes/skills.schema";

export async function getSkills(params: SkillsQuery) {
  const res = await fetch(
    `https://${process.env.MOCKAPI_SECRET_KEY}.mockapi.io/skill?limit=15&page=${params.page || 1}&search=${params.search || ""}`,
  );

  if (!res.ok) {
    new CustomError("Failed to fetch skills");
  }

  let json: AddedSkill[] = await res.json();

  // Handle case when json get string
  if (typeof json === "string") {
    json = [];
  }

  // Validate response at runtime
  const data = SkillsSchema.parse(json);

  return data;
}

// Create a new skill from admin only
export async function createGlobalSkill(skill: Pick<AddedSkill, "skill" | "category" | "logo">) {
  const res = await fetch("https://699d73b883e60a406a4657b7.mockapi.io/skill", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(skill),
  });

  if (!res.ok) {
    new CustomError("Failed to create skill");
  }

  const data: AddedSkill = await res.json();
  return data;
}
