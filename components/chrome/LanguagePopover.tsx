"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { LOCALES } from "@/lib/i18n/dictionary";

export function LanguagePopover() {
  const { locale, setLocale, t } = useLocale();
  const current = LOCALES.find((l) => l.value === locale) ?? LOCALES[0];

  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-1 px-2 py-1 text-sm text-white hover:border hover:border-white">
        <span>{current.flag}</span>
        <span>{current.value.toUpperCase()}</span>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <p className="mb-2 text-sm font-medium">{t("changeLanguage")}</p>
        <div className="space-y-1">
          {LOCALES.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => setLocale(l.value)}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted"
            >
              <span className={`h-3 w-3 rounded-full border ${locale === l.value ? "border-4 border-primary" : ""}`} />
              {l.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{t("shoppingOn")}</p>
      </PopoverContent>
    </Popover>
  );
}
