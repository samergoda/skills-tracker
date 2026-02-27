import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import LogoutButton from "../features/logout-button";

const RTL_LOCALES = ["ar"];

export function AppSidebar({ locale }: { locale: string }) {
  const side = RTL_LOCALES.includes(locale) ? "right" : "left";
  return (
    <Sidebar side={side}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        {/* Logout button */}
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
