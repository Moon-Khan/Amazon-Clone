"use client";

import Link from "next/link";
import { MegaMenu } from "./MegaMenu";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { DictionaryKey } from "@/lib/i18n/dictionary";

const QUICK_LINKS: { key: DictionaryKey; href: string }[] = [
  { key: "todaysDeals", href: "/deals" },
  { key: "buyAgain", href: "/orders" },
  { key: "groceries", href: "/category/grocery" },
  { key: "electronics", href: "/category/electronics" },
  { key: "fashion", href: "/category/womens-fashion" },
  { key: "homeKitchen", href: "/category/home-kitchen" },
];

export function SecondaryNav() {
  const { t } = useLocale();

  return (
    <nav className="flex items-center gap-1 overflow-x-auto bg-az-nav px-1 py-0.5 text-white" aria-label="Secondary">
      <MegaMenu />
      {QUICK_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="shrink-0 whitespace-nowrap px-3 py-2 text-sm hover:border hover:border-white"
        >
          {t(link.key)}
        </Link>
      ))}
      <span className="ml-auto hidden shrink-0 px-3 text-sm font-bold md:inline">{t("fastFreeDelivery")}</span>
    </nav>
  );
}
