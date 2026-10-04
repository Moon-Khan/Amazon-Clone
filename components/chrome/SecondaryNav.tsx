import Link from "next/link";
import { MegaMenu } from "./MegaMenu";

const QUICK_LINKS = [
  { label: "Today's Deals", href: "/deals" },
  { label: "Buy Again", href: "/orders" },
  { label: "Groceries", href: "/category/grocery" },
  { label: "Electronics", href: "/category/electronics" },
  { label: "Fashion", href: "/category/womens-fashion" },
  { label: "Home & Kitchen", href: "/category/home-kitchen" },
];

export function SecondaryNav() {
  return (
    <nav className="flex items-center gap-1 overflow-x-auto bg-az-nav px-1 py-0.5 text-white" aria-label="Secondary">
      <MegaMenu />
      {QUICK_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="shrink-0 whitespace-nowrap px-3 py-2 text-sm hover:border hover:border-white"
        >
          {link.label}
        </Link>
      ))}
      <span className="ml-auto hidden shrink-0 px-3 text-sm font-bold md:inline">
        Fast, free delivery on eligible orders
      </span>
    </nav>
  );
}
