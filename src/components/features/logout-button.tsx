"use client";
import { Button } from "../ui/button";
import { signout } from "@/lib/actions/signout";
import { useTranslations } from "next-intl";

export default function LogoutButton() {
  const t = useTranslations("Auth");
  return <Button onClick={signout}>{t("logout")}</Button>;
}
