"use client";

import Link from "next/link";
import { Logo } from "./Logo";

function comingSoon(feature: string) {
  return `/coming-soon?feature=${encodeURIComponent(feature)}`;
}

// A handful of labels map to real pages already in this build; everything else
// (consistent with the documented scope cuts) routes to a clear "not part of
// this build" page instead of a dead link.
const REAL_ROUTES: Record<string, string> = {
  "Your Account": "/account",
  "Your Orders": "/orders",
};

const COLUMNS: { heading: string; links: string[] }[] = [
  {
    heading: "Get to Know Us",
    links: ["Careers", "About Us", "Accessibility", "Sustainability", "Press Center", "Investor Relations"],
  },
  {
    heading: "Make Money with Us",
    links: ["Sell on Amazon Clone", "Become an Affiliate", "Advertise Your Products", "Self-Publish with Us"],
  },
  {
    heading: "Payment Products",
    links: ["Amazon Clone Visa", "Store Card", "Gift Cards", "Reload Your Balance", "Currency Converter"],
  },
  {
    heading: "Let Us Help You",
    links: ["Your Account", "Your Orders", "Customer Service", "Shipping Rates & Policies", "Returns & Replacements"],
  },
];

const SITEMAP: string[] = [
  "Amazon Music",
  "Amazon Ads",
  "6pm",
  "AbeBooks",
  "ACX",
  "Sell on Amazon",
  "Amazon Business",
  "AmazonGlobal",
  "Home Services",
  "Amazon Web Services",
  "Audible",
  "Box Office Mojo",
  "Goodreads",
  "IMDb",
  "Kindle Direct Publishing",
  "Amazon Photos",
  "Shopbop",
  "Whole Foods Market",
  "Woot!",
  "Zappos",
  "Ring",
  "eero WiFi",
  "Blink",
  "Neighbors App",
  "Amazon Renewed",
];

function hrefForLabel(label: string) {
  return REAL_ROUTES[label] ?? comingSoon(label);
}

export function Footer() {
  return (
    <footer className="mt-auto bg-az-nav text-sm text-neutral-200">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="block w-full bg-[#37475a] py-3 text-center hover:bg-az-nav-hover"
      >
        Back to top
      </button>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <h3 className="mb-3 font-bold text-white">{col.heading}</h3>
            <ul className="space-y-2">
              {col.links.map((label) => (
                <li key={label}>
                  <Link href={hrefForLabel(label)} className="hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-6">
          <Logo />
          <div className="flex gap-4 text-xs">
            <span className="rounded border border-neutral-500 px-2 py-1">🌐 English</span>
            <span className="rounded border border-neutral-500 px-2 py-1">🇺🇸 United States</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-2 px-6 py-6 text-xs text-neutral-400 sm:grid-cols-4 md:grid-cols-6">
          {SITEMAP.map((label) => (
            <Link key={label} href={hrefForLabel(label)} className="hover:underline">
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-neutral-400">
        <div className="mb-2 flex justify-center gap-4">
          <Link href={comingSoon("Conditions of Use")} className="hover:underline">
            Conditions of Use
          </Link>
          <Link href={comingSoon("Privacy Notice")} className="hover:underline">
            Privacy Notice
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Amazon Clone. Built for the 8x Software Engineer assignment - not affiliated with Amazon.com, Inc.</p>
      </div>
    </footer>
  );
}
