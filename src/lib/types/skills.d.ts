type Skill = {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  is_public: string;
  createdAt: string;
  ownerId: string;
};

type AddedSkill = {
  id: string;
  skill: string;
  logo: string;
  category: string;
  createdAt: string;
};

type SkillsQuery = {
  page?: string;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
};
