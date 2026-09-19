"use client";

import React from "react";
import Link from "next/link";
import { Bot, TrendingUp, ArrowRight } from "lucide-react";

interface OpportunityCardProps {
  title: string;
  subtitle: string;
  actionText: string;
  targetHref: string;
  expectedRevenue?: string;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  title,
  subtitle,
  actionText,
  targetHref,
  expectedRevenue,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-md font-sans">
      <div className="flex items-center space-x-2 text-paytm-cyan text-xs font-extrabold uppercase tracking-wider mb-2">
        <Bot className="w-4 h-4" />
        <span>Teammate Recommendation</span>
      </div>

      <h3 className="text-lg font-extrabold text-white mb-1.5 leading-snug">{title}</h3>
      <p className="text-xs text-slate-300 mb-4 leading-relaxed max-w-xl">{subtitle}</p>

      {expectedRevenue && (
        <div className="inline-flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/60 px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-400 mb-4">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Expected Revenue Boost: {expectedRevenue}</span>
        </div>
      )}

      <div>
        <Link
          href={targetHref}
          className="inline-flex items-center space-x-2 bg-paytm-cyan text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl hover:bg-white transition-all shadow-xs"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
