import { getTranslations } from "next-intl/server";
import EmptySkillsList from "./EmptySkillsList";
import ActionsSkillsList from "./ActionsSkillsList";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import AddSkill from "./AddSkill";

export default async function SkillsList({ skills }: { skills: Skill[] }) {
  const t = await getTranslations("Skills");

  // Need to optimize it.
  const uniqueIds = [...new Set(skills.map((skill) => skill.ownerId))];
  const skillUsers = await Promise.all(uniqueIds.map((id) => db.query.users.findFirst({ where: eq(users.id, id) })));
  function difficultyColor(diff: string) {
    switch (diff) {
      case "Beginner":
        return "bg-green-100 text-green-700";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "Advanced":
        return "bg-red-100 text-red-700";
    }
  }

  const skillsUserMap = new Map<string, { firstName: string; lastName: string }>();
  skillUsers.forEach((user) => {
    if (user) skillsUserMap.set(user.id, { firstName: user.firstName, lastName: user.lastName });
  });

  if (!skills.length) return <EmptySkillsList />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">{t("dashboard")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("total", { count: skills.length })}</p>
        </div>

        <AddSkill />
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-1">
        {skills.map((skill) => {
          return (
            <div
              key={skill.id}
              className="group rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              {/* Title + Status */}
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-medium">{skill.name}</h2>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    skill.is_public === "true" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                  }`}>
                  {skill.is_public === "true" ? t("public") : t("private")}
                </span>
              </div>

              {/* Category */}
              <p className="text-sm text-muted-foreground">{skill.category}</p>

              {/* Difficulty + Date */}
              <div className="mt-4 flex justify-between items-center">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColor(skill.difficulty)}`}>
                  {skill.difficulty}
                </span>

                <span className="text-xs text-muted-foreground">{new Date(skill.createdAt).toLocaleDateString()}</span>
              </div>

              {/* User name */}
              <div className="flex items-center gap-2 mt-4">
                <p className="text-muted-foreground">{t("user")} :</p>
                <p className="text-muted-foreground">{skillsUserMap.get(skill.ownerId)?.firstName}</p>
              </div>

              {/* Actions */}
              <ActionsSkillsList skill={skill} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
