import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { getClerkLocalization } from "@/i18n/clerk";
import type { Locale } from "@/i18n/config";

const outfit = Outfit({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();

  return (
    <ClerkProvider localization={getClerkLocalization(locale)}>
      <html lang={locale} suppressHydrationWarning>
        <body className={outfit.className} suppressHydrationWarning>
          <NextIntlClientProvider messages={messages}>
            <Provider>
              {children}
            </Provider>
          </NextIntlClientProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
