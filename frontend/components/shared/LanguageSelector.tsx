"use client";

import React from "react";
import { ChatLanguage } from "@/types";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  selectedLanguage: ChatLanguage;
  onLanguageChange: (lang: ChatLanguage) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
      <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
      {(["hinglish", "hindi", "english"] as ChatLanguage[]).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onLanguageChange(lang)}
          className={`px-2.5 py-1 rounded font-medium capitalize transition-all ${
            selectedLanguage === lang
              ? "bg-paytm-navy text-white font-bold shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          }`}
        >
          {lang === "hinglish" ? "Hinglish" : lang === "hindi" ? "हिंदी" : "English"}
        </button>
      ))}
    </div>
  );
};
