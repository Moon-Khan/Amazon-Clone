"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OPTIONS: { value: string; label: string }[] = [
  { value: "relevance", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Customer Review" },
  { value: "newest", label: "Newest Arrivals" },
];

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(next: string | null) {
    if (!next) return;
    const params = new URLSearchParams(searchParams.toString());
    if (next === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", next);
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-56" aria-label="Sort by">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <SelectValue>{OPTIONS.find((o) => o.value === value)?.label ?? "Featured"}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
