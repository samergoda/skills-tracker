import React from "react";
import { ThemeProvider } from "@/components/providers/components/theme.provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NextIntlClientProvider, useMessages, useNow, useTimeZone } from "next-intl";
import { getLocale } from "next-intl/server";
import ReactQueryProvider from "./components/react-query.provider";

export default async function RootProviders({ children }: { children: React.ReactNode }) {
  //Translation
  const locale = await getLocale();

  return (
    <NextIntlClientProvider locale={locale}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </TooltipProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
