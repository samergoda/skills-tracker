import { Geist, Geist_Mono } from "next/font/google";
import RootProviders from "@/components/providers";
import { ErrorBoundary } from "react-error-boundary";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate static params for locals for build time
export function generateStaticParams() {
  return [{ local: "en" }, { local: "ar" }];
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ local: string }> }) {
  const { local } = await params;

  // Set the locale for the request
  setRequestLocale(local);

  // Check if the locale is valid
  // if (!routing.locales.includes(local as Locale)) // Old way
  if (!hasLocale(routing.locales, local)) {
    notFound();
  }

  return (
    <html lang={local} dir={local === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <Suspense>
          <ErrorBoundary fallback={<div>Something went wrong!</div>}>
            <RootProviders>{children}</RootProviders>
          </ErrorBoundary>
        </Suspense>
      </body>
    </html>
  );
}
