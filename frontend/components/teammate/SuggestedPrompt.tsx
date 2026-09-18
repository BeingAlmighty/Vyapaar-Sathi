"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface SuggestedPromptProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
}

export const SuggestedPrompt: React.FC<SuggestedPromptProps> = ({
  prompts,
  onSelectPrompt,
}) => {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-paytm-cyan" />
        <span>Contextual Quick Inquiries</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(prompt)}
            className="text-xs bg-slate-100 hover:bg-paytm-lightBlue hover:text-paytm-navy border border-slate-200 hover:border-paytm-cyan/50 text-slate-700 px-3 py-1.5 rounded-full font-medium transition-all shadow-xs text-left"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
