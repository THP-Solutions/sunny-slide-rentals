'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Lang = 'en' | 'es';

interface LangCtx {
  lang: Lang;
  toggle: () => void;
  t: (en: string, es: string) => string;
}

const LanguageContext = createContext<LangCtx>({
  lang: 'en',
  toggle: () => {},
  t: (en) => en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved === 'en' || saved === 'es') setLang(saved);
  }, []);

  const toggle = () => {
    setLang((prev) => {
      const next = prev === 'en' ? 'es' : 'en';
      localStorage.setItem('lang', next);
      return next;
    });
  };

  const t = (en: string, es: string) => (lang === 'es' ? es : en);

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
