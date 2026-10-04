"use client";

import { ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function comingSoon(feature: string) {
  return `/coming-soon?feature=${encodeURIComponent(feature)}`;
}

type MenuSection = {
  heading: string;
  links: { label: string; href: string; hasSubmenu?: boolean }[];
  seeAllHref?: string;
};

const SECTIONS: MenuSection[] = [
  {
    heading: "Trending",
    links: [
      { label: "Best Sellers", href: "/best-sellers" },
      { label: "New Releases", href: "/new-releases" },
      { label: "Grocery", href: "/category/grocery" },
    ],
  },
  {
    heading: "Digital Content & Devices",
    links: [
      { label: "Prime Video", href: comingSoon("Prime Video"), hasSubmenu: true },
      { label: "Amazon Music", href: comingSoon("Amazon Music"), hasSubmenu: true },
      { label: "Echo & Alexa", href: comingSoon("Echo & Alexa"), hasSubmenu: true },
      { label: "Fire Tablets", href: comingSoon("Fire Tablets"), hasSubmenu: true },
      { label: "Fire TV", href: comingSoon("Fire TV"), hasSubmenu: true },
      { label: "Kindle E-readers & Books", href: comingSoon("Kindle E-readers & Books"), hasSubmenu: true },
      { label: "Audible Books & Originals", href: comingSoon("Audible Books & Originals"), hasSubmenu: true },
    ],
  },
  {
    heading: "Shop by Category",
    links: [
      { label: "Electronics", href: "/category/electronics" },
      { label: "Beauty & Personal Care", href: "/category/beauty-personal-care" },
      { label: "Men's Fashion", href: "/category/mens-fashion" },
      { label: "Women's Fashion", href: "/category/womens-fashion" },
      { label: "Home & Kitchen", href: "/category/home-kitchen" },
    ],
    seeAllHref: "/search",
  },
  {
    heading: "Programs & Features",
    links: [
      { label: "Same-Day Delivery", href: comingSoon("Same-Day Delivery") },
      { label: "Medical Care & Pharmacy", href: comingSoon("Medical Care & Pharmacy") },
    ],
    seeAllHref: comingSoon("Programs & Features"),
  },
];

export function MegaMenu() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user ?? null;
  const { t } = useLocale();

  const helpSection: MenuSection = {
    heading: "Help & Settings",
    links: [
      { label: "Customer Service", href: comingSoon("Customer Service") },
      { label: "Your Account", href: user ? "/account" : "/login" },
    ],
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-white hover:border hover:border-white"
      >
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
          <path d="M1 1H17M1 7H17M1 13H17" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {t("all")}
      </button>
      <SheetContent side="left" className="w-80 overflow-y-auto bg-white p-0 sm:w-96">
        <SheetHeader className="flex-row items-center gap-3 space-y-0 bg-az-header px-4 py-4">
          <SheetClose aria-label="Close menu" className="text-white">
            <X className="h-5 w-5" />
          </SheetClose>
          <SheetTitle className="text-base font-normal text-white">
            {user ? t("helloName", { name: user.name ?? "" }) : t("helloSignIn")}
          </SheetTitle>
        </SheetHeader>

        {[...SECTIONS, helpSection].map((section) => (
          <div key={section.heading} className="border-b py-3">
            <h3 className="px-4 pb-2 text-base font-bold">{section.heading}</h3>
            <ul>
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted"
                  >
                    {link.label}
                    {link.hasSubmenu && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </Link>
                </li>
              ))}
              {section.heading === "Help & Settings" && user && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-muted"
                  >
                    Sign Out
                  </button>
                </li>
              )}
              {section.seeAllHref && (
                <li>
                  <Link
                    href={section.seeAllHref}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-az-link hover:underline"
                  >
                    See all
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        ))}
      </SheetContent>
    </Sheet>
  );
}
