import { NextIntlClientProvider } from "next-intl";

import { Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import RootProviders from "@/components/providers";

type Props = {
  children: React.ReactNode;
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
