import { CustomError } from "../util/customError";

export async function getSkills(params: SkillsQuery) {
  console.log("get skill dataaa", params);
  const res = await fetch(
    `https://699d73b883e60a406a4657b7.mockapi.io/skill?limit=15&page=${params.page || 1}&search=${params.search || ""}&order=${params.order || "desc"}`,
  );

  if (!res.ok) {
    new CustomError("Failed to fetch skills");
  }

  const data: AddedSkill[] = await res.json();

  console.log("get skill dataaa", data);
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
