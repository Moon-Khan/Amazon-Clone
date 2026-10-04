"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEPARTMENTS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Electronics", value: "electronics" },
  { label: "Beauty & Personal Care", value: "beauty-personal-care" },
  { label: "Men's Fashion", value: "mens-fashion" },
  { label: "Women's Fashion", value: "womens-fashion" },
  { label: "Home & Kitchen", value: "home-kitchen" },
  { label: "Grocery", value: "grocery" },
  { label: "Sports & Outdoors", value: "sports-outdoors" },
  { label: "Automotive", value: "automotive" },
  { label: "Accessories", value: "accessories" },
];

export function SearchBar() {
  const [department, setDepartment] = useState("all");

  return (
    <form action="/search" className="flex h-10 flex-1" role="search" aria-label="Site search">
      <Select value={department} onValueChange={(v) => v && setDepartment(v)} name="category">
        <SelectTrigger className="w-auto rounded-r-none rounded-l-md border-r bg-neutral-100 text-xs text-black focus-visible:ring-0">
          <SelectValue>{DEPARTMENTS.find((d) => d.value === department)?.label ?? "All"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {DEPARTMENTS.map((dept) => (
            <SelectItem key={dept.value} value={dept.value}>
              {dept.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input
        type="text"
        name="q"
        placeholder="Search Amazon Clone"
        aria-label="Search"
        className="h-10 flex-1 border-0 bg-white px-3 text-base text-black outline-none"
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
