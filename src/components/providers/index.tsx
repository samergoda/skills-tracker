import React from "react";
import { ThemeProvider } from "@/components/providers/_components/theme.provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NextIntlClientProvider, useMessages, useNow, useTimeZone } from "next-intl";
import { getLocale } from "next-intl/server";
import ReactQueryProvider from "./_components/react-query.provider";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default async function RootProviders({ children }: { children: React.ReactNode }) {
  //Translation
  const locale = await getLocale();

  return (
    <NextIntlClientProvider locale={locale}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <ReactQueryProvider>
            {/* Toaster */}
            <Toaster />

            {/* Nuqs */}
            <NuqsAdapter>
              {/* Children */}
              {children}
            </NuqsAdapter>
          </ReactQueryProvider>
        </TooltipProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
