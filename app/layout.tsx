import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import "./globals.css";
import { Header } from "@/components/chrome/Header";
import { SecondaryNav } from "@/components/chrome/SecondaryNav";
import { Footer } from "@/components/chrome/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amazon Clone",
  description: "8x Software Engineer assignment - Amazon.com rebuild",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SessionProvider>
          <LocaleProvider>
            <Header />
            <SecondaryNav />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
          </LocaleProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
