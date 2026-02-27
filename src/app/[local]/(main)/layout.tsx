import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ReactNode, Suspense } from "react";
import { ThemeSwitcher } from "@/components/features/theme-switcher";
import { getLocale, getTranslations } from "next-intl/server";
import LocaleToggle from "@/components/features/lang-toggle";
import { ChartNoAxesColumn } from "lucide-react";

export default async function MainLayout({ children }: { children: ReactNode }) {
  // Locale
  const locale = await getLocale();

  // Translations
  const t = await getTranslations("HomePage");

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar locale={locale} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4">
          {/* Sidebar trigger */}
          <SidebarTrigger />

          {/* App title */}
          <div className="flex items-center gap-2">
            {/* Icon */}
            <ChartNoAxesColumn className="text-custom-rose-900" />

            {/* Title */}
            <h2 className="text-xl font-bold">{t("skills-tracker")}</h2>
          </div>

          {/* Contollers */}
          <div className="flex items-center gap-2">
            {/* Theme switcher */}
            <ThemeSwitcher />

            {/* Language switcher */}
            <Suspense fallback={"loading.."}>
              <LocaleToggle />
            </Suspense>
          </div>
        </div>

        {/* Children */}
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </SidebarProvider>
  );
}
