import { Geist, Geist_Mono } from "next/font/google";
import RootProviders from "@/components/providers";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

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

  // Check if the locale is valid
  if (!routing.locales.includes(local as Locale)) {
    notFound();
  }
  return (
    <html lang={local} dir={local === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <ErrorBoundary fallback={<div>Something went wrong!</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <RootProviders>{children}</RootProviders>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  );
}
