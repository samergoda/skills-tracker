import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("HomePage");
  return <h1>{t("title")} dashboard</h1>;
}
