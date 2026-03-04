import { ThemeProvider } from "@/components/providers/_components/theme.provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NextIntlClientProvider, useMessages, useNow, useTimeZone } from "next-intl";
import { getLocale } from "next-intl/server";
import ReactQueryProvider from "./_components/react-query.provider";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

export default async function RootProviders({ children }: { children: ReactNode }) {
  //Translation
  const locale = await getLocale();
  return (
    <NextIntlClientProvider locale={locale}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <ReactQueryProvider>
            {/* Toaster */}
            <Toaster theme="system" position="top-center" richColors />

            {/* Children */}
            {children}
          </ReactQueryProvider>
        </TooltipProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
