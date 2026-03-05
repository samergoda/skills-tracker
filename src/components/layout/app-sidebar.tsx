"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import LogoutButton from "../features/logout-button";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, Settings } from "lucide-react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { SiChatbot } from "react-icons/si";

type NavItem = {
  labelKey: string;
  href: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  {
    labelKey: "dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    labelKey: "settings",
    href: "/settings",
    icon: Settings,
  },
  {
    labelKey: "chatbot",
    href: "/chatbot",
    icon: SiChatbot,
  }
];

export function AppSidebar() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();


  return (
    <Sidebar>
      <SidebarHeader />

      <SidebarContent>
        <SidebarGroup>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.endsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    "flex-row rtl:flex-row-reverse",
                    isActive ? "bg-muted font-medium" : "hover:bg-muted/60",
                  )}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{t(item.labelKey as "dashboard" | "settings" | 'chatbot')}</span>
                </Link>
              );
            })}
          </nav>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
