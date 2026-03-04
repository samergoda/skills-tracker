import { getSkills } from "@/lib/api/skills.api";
// import { getTranslations } from "next-intl/server";
import { SkillsTable } from "./_components/skills-table";

type SkillsQuery = {
  page?: string;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
};

export default async function SkillsPage({ searchParams }: { searchParams: Promise<SkillsQuery> }) {
  const params = await searchParams;

  const skills = await getSkills(params);
  // const t = await getTranslations("SkillsPage");

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
          <p className="text-muted-foreground text-sm">Manage your skills here.</p>
        </div>
      </div>

      <SkillsTable initialSkills={skills} />
    </div>
  );
}
