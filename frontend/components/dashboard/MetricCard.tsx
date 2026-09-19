"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changePeriod?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "warning" | "success" | "danger";
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changePeriod = "vs last month",
  subtitle,
  icon,
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 font-sans flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-200/60 text-slate-700 shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>

        {change !== undefined && (
          <div
            className={cn(
              "flex items-center space-x-0.5 text-xs font-bold px-2.5 py-1 rounded-full shrink-0",
              isPositive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : isNegative
                ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                : "bg-slate-100 text-slate-600 border border-slate-200/60"
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
            ) : isNegative ? (
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <Minus className="w-3.5 h-3.5 mr-0.5" />
            )}
            <span>
              {isPositive ? "+" : ""}
              {change.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {(subtitle || changePeriod) && (
        <div className="text-xs text-slate-400 font-medium mt-3">
          <span>{subtitle || changePeriod}</span>
        </div>
      )}
    </div>
  );
};
