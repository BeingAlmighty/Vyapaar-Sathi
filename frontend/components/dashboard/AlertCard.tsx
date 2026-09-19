"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Lightbulb, ArrowRight } from "lucide-react";
import { BusinessAlert } from "@/types";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  alert: BusinessAlert;
  onActionClick?: (alertTitle: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onActionClick }) => {
  const isWarning = alert.type === "warning";

  return (
    <div
      className={cn(
        "p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 hover:-translate-y-0.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] font-sans",
        isWarning
          ? "bg-rose-50/40 border-rose-200/70 hover:border-rose-300"
          : "bg-sky-50/40 border-sky-200/70 hover:border-sky-300"
      )}
    >
      <div className="flex items-start space-x-3.5">
        <div
          className={cn(
            "p-2.5 rounded-xl shrink-0 mt-0.5 shadow-2xs",
            isWarning ? "bg-rose-100 text-rose-700" : "bg-sky-100 text-sky-800"
          )}
        >
          {isWarning ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <Lightbulb className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              {isWarning ? "Needs Attention" : "AI Growth Opportunity"}
            </h4>
            <span
              className={cn(
                "px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider",
                isWarning ? "bg-rose-100 text-rose-800" : "bg-sky-100 text-sky-800"
              )}
            >
              {isWarning ? "Priority" : "Growth"}
            </span>
          </div>

          <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{alert.title}</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-200/60 flex justify-end">
        <Link
          href={`/teammate?query=${encodeURIComponent(alert.title)}`}
          className="inline-flex items-center space-x-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
          onClick={() => onActionClick && onActionClick(alert.title)}
        >
          <span>Investigate with AI</span>
          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>
    </div>
  );
};
