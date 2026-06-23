"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100/80 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition-all duration-200"
    >
      <Languages size={13} />
      <span className="tracking-wide">{lang === "en" ? "AR" : "EN"}</span>
    </button>
  );
}
