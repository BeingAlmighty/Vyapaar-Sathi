"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, AlertTriangle, Lightbulb, Sparkles, ArrowRight } from "lucide-react";
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
        "p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3",
        isWarning
          ? "bg-red-50/50 border-red-200/80 text-red-950"
          : "bg-blue-50/50 border-blue-200/80 text-blue-950"
      )}
    >
      <div className="flex items-start space-x-3">
        <div
          className={cn(
            "p-2 rounded-lg shrink-0 mt-0.5",
            isWarning ? "bg-red-100 text-red-700" : "bg-blue-100 text-paytm-navy"
          )}
        >
          {isWarning ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <Lightbulb className="w-5 h-5 text-amber-600" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {isWarning ? "Needs Attention" : "AI Opportunity"}
            </h4>
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase",
                isWarning ? "bg-red-200 text-red-800" : "bg-blue-200 text-paytm-navy"
              )}
            >
              {isWarning ? "Priority" : "Growth"}
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 leading-snug">{alert.title}</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200/60 flex justify-end">
        <Link
          href={`/teammate?query=${encodeURIComponent(alert.title)}`}
          className={cn(
            "inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-2xs",
            isWarning
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-paytm-navy text-white hover:bg-paytm-darkBlue"
          )}
          onClick={() => onActionClick && onActionClick(alert.title)}
        >
          <Sparkles className="w-3.5 h-3.5 text-paytm-cyan" />
          <span>Investigate with AI</span>
          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>
    </div>
  );
};
