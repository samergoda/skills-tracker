import { useTranslations } from "next-intl";
import AddSkill from "./AddSkill";

export default function EmptySkillsList() {
  const t = useTranslations("Skills");
  return (
    <div className="max-w-4xl mx-auto p-10 text-center">
      <AddSkill />
      <h2 className="text-xl font-semibold mb-2">{t("noSkillsYet")}</h2>
      <p className="text-muted-foreground">{t("startAdding")}</p>
    </div>
  );
}
