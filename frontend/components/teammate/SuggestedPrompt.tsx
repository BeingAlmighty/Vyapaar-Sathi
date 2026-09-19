"use client";

import React from "react";
import { MessageSquare } from "lucide-react";

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
    <div className="space-y-2 font-sans">
      <div className="flex items-center space-x-1.5 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
        <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
        <span>Contextual Quick Inquiries</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(prompt)}
            className="text-xs bg-slate-100/80 hover:bg-slate-900 hover:text-white border border-slate-200/60 text-slate-700 px-4 py-1.5 rounded-full font-semibold transition-all shadow-2xs text-left"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
