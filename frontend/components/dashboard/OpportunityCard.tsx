"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";

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
    <div className="bg-gradient-to-br from-paytm-navy via-slate-900 to-slate-950 text-white rounded-xl p-5 shadow-paytm-card relative overflow-hidden border border-slate-800">
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-paytm-cyan/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center space-x-2 text-paytm-cyan text-xs font-bold uppercase tracking-wider mb-2">
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span>Teammate Recommendation</span>
      </div>

      <h3 className="text-lg font-bold text-white mb-1 leading-snug">{title}</h3>
      <p className="text-xs text-slate-300 mb-4 leading-relaxed max-w-xl">{subtitle}</p>

      {expectedRevenue && (
        <div className="inline-flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-lg text-xs font-semibold text-emerald-400 mb-4">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Expected Revenue Boost: {expectedRevenue}</span>
        </div>
      )}

      <div>
        <Link
          href={targetHref}
          className="inline-flex items-center space-x-2 bg-paytm-cyan text-paytm-navy font-bold text-xs px-4 py-2 rounded-lg hover:bg-white transition-all shadow-md"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
