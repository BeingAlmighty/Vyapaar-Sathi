"use client";

import React, { useState } from "react";
import { Send, Sparkles, Mic, Loader2 } from "lucide-react";
import { ChatLanguage } from "@/types";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  selectedLanguage: ChatLanguage;
  onLanguageChange: (lang: ChatLanguage) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading = false,
  selectedLanguage,
  onLanguageChange,
}) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-t border-slate-200 p-3 sm:p-4">
      <div className="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded-xl p-2 focus-within:border-paytm-cyan focus-within:ring-2 focus-within:ring-paytm-cyan/20 transition-all">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            selectedLanguage === "hinglish"
              ? "Pucho, e.g., 'Meri sales kyun gir rahi hai?'..."
              : selectedLanguage === "hindi"
              ? "पूछें, जैसे 'मेरी बिक्री क्यों गिर रही है?'..."
              : "Ask your business teammate, e.g. 'Why are sales falling?'..."
          }
          className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none px-2"
          disabled={isLoading}
        />

        <button
          type="button"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          title="Voice input (Demo)"
        >
          <Mic className="w-4 h-4" />
        </button>

        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="bg-paytm-navy text-white font-bold text-xs px-3.5 py-2 rounded-lg hover:bg-paytm-darkBlue transition-all flex items-center space-x-1.5 disabled:opacity-50 shadow-xs"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-paytm-cyan" />
          ) : (
            <>
              <span className="hidden sm:inline">Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
