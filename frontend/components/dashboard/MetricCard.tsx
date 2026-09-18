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
  variant = "default",
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-paytm-sm hover:shadow-paytm-card transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {icon && <div className="text-paytm-navy opacity-80">{icon}</div>}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>

        {change !== undefined && (
          <div
            className={cn(
              "flex items-center space-x-0.5 text-xs font-bold px-2 py-0.5 rounded-full",
              isPositive
                ? "bg-emerald-50 text-emerald-700"
                : isNegative
                ? "bg-red-50 text-red-700"
                : "bg-slate-100 text-slate-600"
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
        <div className="text-[11px] text-slate-400 font-medium mt-2 flex items-center justify-between">
          <span>{subtitle || changePeriod}</span>
        </div>
      )}
    </div>
  );
};
