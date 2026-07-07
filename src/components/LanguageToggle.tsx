"use client";

import { useLanguage } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, toggle } = useLanguage();

  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={toggle}
      aria-label={lang === "es" ? "Switch to English" : "Cambiar a Español"}
    >
      <span className={lang === "es" ? "on" : ""}>ES</span>
      <span className="sep">/</span>
      <span className={lang === "en" ? "on" : ""}>EN</span>
    </button>
  );
}
