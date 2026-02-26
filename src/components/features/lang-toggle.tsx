"use client";

import { Globe } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

const LOCALES = [
  {
    value: "en",
    label: "English",
  },
  {
    value: "ar",
    label: "العربية",
  },
];

export default function LocaleToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const switchLocale = (nextLocale: Locale) => {
    router.replace(
      {
        pathname,
        query: Object.fromEntries(searchParams.entries()),
      },
      { locale: nextLocale },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="text-custom-rose-900 p-0">
          <Globe size={20} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={locale} onValueChange={(value) => switchLocale(value as Locale)}>
          {LOCALES.map((locale) => (
            <DropdownMenuRadioItem key={locale.value} value={locale.value}>
              {locale.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
