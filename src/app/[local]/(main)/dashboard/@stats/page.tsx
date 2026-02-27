import { useTranslations } from "next-intl";

export default function page() {
  const t = useTranslations("HomePage");
  return <h1>{t("title")} stats</h1>;
}
