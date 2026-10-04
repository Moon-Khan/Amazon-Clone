"use client";

import { ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";

type MenuSection = {
  heading: string;
  links: { label: string; href: string; hasSubmenu?: boolean }[];
  seeAll?: boolean;
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
      { label: "Prime Video", href: "#", hasSubmenu: true },
      { label: "Amazon Music", href: "#", hasSubmenu: true },
      { label: "Echo & Alexa", href: "#", hasSubmenu: true },
      { label: "Fire Tablets", href: "#", hasSubmenu: true },
      { label: "Fire TV", href: "#", hasSubmenu: true },
      { label: "Kindle E-readers & Books", href: "#", hasSubmenu: true },
      { label: "Audible Books & Originals", href: "#", hasSubmenu: true },
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
    seeAll: true,
  },
  {
    heading: "Programs & Features",
    links: [
      { label: "Same-Day Delivery", href: "#" },
      { label: "Medical Care & Pharmacy", href: "#" },
    ],
    seeAll: true,
  },
  {
    heading: "Help & Settings",
    links: [
      { label: "Customer Service", href: "#" },
      { label: "Your Account", href: "#" },
      { label: "Sign Out", href: "#" },
    ],
  },
];

export function MegaMenu() {
  const [open, setOpen] = useState(false);

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
        All
      </button>
      <SheetContent side="left" className="w-80 overflow-y-auto bg-white p-0 sm:w-96">
        <SheetHeader className="flex-row items-center gap-3 space-y-0 bg-az-header px-4 py-4">
          <SheetClose aria-label="Close menu" className="text-white">
            <X className="h-5 w-5" />
          </SheetClose>
          <SheetTitle className="text-base font-normal text-white">Hello, sign in</SheetTitle>
        </SheetHeader>

        {SECTIONS.map((section) => (
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
              {section.seeAll && (
                <li>
                  <Link
                    href="#"
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
