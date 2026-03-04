"use client";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import LogoutButton from "../features/logout-button";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, Settings } from "lucide-react";
import clsx from "clsx";

const RTL_LOCALES = ["ar"];

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar({ locale }: { locale: string }) {
  const side = RTL_LOCALES.includes(locale) ? "right" : "left";
  const pathname = usePathname();

  return (
    <Sidebar side={side}>
      <SidebarHeader />

      <SidebarContent>
        <SidebarGroup>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive ? "bg-muted font-medium" : "hover:bg-muted/60",
                  )}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
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
