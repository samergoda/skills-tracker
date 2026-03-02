import { Geist, Geist_Mono } from "next/font/google";
import RootProviders from "@/components/providers";
import { Suspense } from "react";

type Props = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate static params for locales for build time
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function RootLayout({ children, params }: Props) {
  return (
    <html lang={params.locale} dir={params.locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <RootProviders>{children}</RootProviders>
        </Suspense>
      </body>
    </html>
  );
}
