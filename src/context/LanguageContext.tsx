"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { dictionaries, type Locale, type QrOrderDictionary } from "@/locales";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dictionary: QrOrderDictionary;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LOCALE_KEY = "jgd_qr_order_locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(LOCALE_KEY) as Locale | null;
        if (saved && (saved === "lo" || saved === "th" || saved === "en")) {
          return saved;
        }
      } catch {
        // Fallback
      }
    }
    return "lo";
  });

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_KEY, next);
    } catch {
      // Ignore
    }
    document.documentElement.lang = next;
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      dictionary: dictionaries[locale],
    }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
