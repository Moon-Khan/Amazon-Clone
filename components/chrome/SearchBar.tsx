import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEPARTMENTS = [
  "All",
  "Electronics",
  "Beauty & Personal Care",
  "Men's Fashion",
  "Women's Fashion",
  "Home & Kitchen",
  "Grocery",
  "Sports & Outdoors",
  "Automotive",
  "Accessories",
];

/** Search is visual/navigational only until Phase 3 wires it to the catalog API. */
export function SearchBar() {
  return (
    <form action="/search" className="flex h-10 flex-1" role="search" aria-label="Site search">
      <Select defaultValue="All" name="department">
        <SelectTrigger className="w-auto rounded-r-none rounded-l-md border-r bg-neutral-100 text-xs text-black focus-visible:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DEPARTMENTS.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input
        type="text"
        name="q"
        placeholder="Search Amazon Clone"
        aria-label="Search"
        className="h-10 flex-1 border-0 px-3 text-base text-black outline-none"
      />
      <button
        type="submit"
        aria-label="Submit search"
        className="flex h-10 w-12 items-center justify-center rounded-r-md bg-az-cta-orange hover:bg-az-cta-orange-hover"
      >
        <Search className="h-5 w-5 text-black" />
      </button>
    </form>
  );
}
