"use client";

import { createContext, useContext, useCallback, useSyncExternalStore } from "react";
import { DICTIONARIES, type DictionaryKey, type Locale } from "./dictionary";

const STORAGE_KEY = "locale";
const CHANGE_EVENT = "locale-store-change";

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "es";
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

function getSnapshot(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isLocale(stored) ? stored : "en";
}

function getServerSnapshot(): Locale {
  return "en";
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: DictionaryKey, vars?: Record<string, string>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const t = useCallback(
    (key: DictionaryKey, vars?: Record<string, string>) => {
      let str: string = DICTIONARIES[locale][key];
      if (vars) {
        for (const [k, v] of Object.entries(vars)) str = str.replace(`{${k}}`, v);
      }
      return str;
    },
    [locale],
  );

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
