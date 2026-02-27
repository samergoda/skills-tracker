import { findByUser } from "@/lib/actions/skills.action";
import { getTranslations } from "next-intl/server";
import SkillsList from "./_components/SkillsList";

export default async function page() {
  // Translations
  const t = await getTranslations("HomePage");

  // Get skills based on rule
  const skills = await findByUser();
  console.log("skills", skills);
  return (
    <>
      <h1>{t("title")} skills</h1>
      <SkillsList skills={skills} />
    </>
  );
}
