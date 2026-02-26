import { ThemeSwitcher } from "@/components/features/theme-switcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="absolute right-4 top-4 z-50">
        <ThemeSwitcher />
      </div>
      {children}
    </>
  );
}
