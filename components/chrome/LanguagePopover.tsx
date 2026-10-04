"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/** Visual-only stub - see docs/PLAN.md MVP scope (language switching is not functional). */
export function LanguagePopover() {
  const [lang, setLang] = useState<"en" | "es">("en");

  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-1 px-2 py-1 text-sm text-white hover:border hover:border-white">
        <span>🇺🇸</span>
        <span>{lang.toUpperCase()}</span>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <p className="mb-2 text-sm font-medium">Change language</p>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setLang("en")}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted"
          >
            <span className={`h-3 w-3 rounded-full border ${lang === "en" ? "border-4 border-primary" : ""}`} />
            English - EN
          </button>
          <button
            type="button"
            onClick={() => setLang("es")}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted"
          >
            <span className={`h-3 w-3 rounded-full border ${lang === "es" ? "border-4 border-primary" : ""}`} />
            español - ES
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">You are shopping on Amazon Clone.</p>
      </PopoverContent>
    </Popover>
  );
}
