import { findByUser } from "@/lib/actions/skills.action";
import { getTranslations } from "next-intl/server";
import SkillsList from "./_components/SkillsList";

export default async function page() {
  // Translations
  const t = await getTranslations("Skills");

  // Get skills based on rule
  const skills = await findByUser();
  return (
    <>
      <h1>{t("title")}</h1>
      <SkillsList skills={skills} />
    </>
  );
}
