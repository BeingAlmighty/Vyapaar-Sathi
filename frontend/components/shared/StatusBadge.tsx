"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  type?: "stock" | "effectiveness" | "campaign" | "risk";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = "stock",
  className,
}) => {
  const normalized = status.toLowerCase().replace(/_/g, " ");

  let colorClasses = "bg-slate-100 text-slate-700 border-slate-200";

  if (normalized.includes("risk") || normalized.includes("low stock") || normalized.includes("ineffective") || normalized.includes("rejected")) {
    colorClasses = "bg-red-50 text-red-700 border-red-200 font-bold";
  } else if (normalized.includes("excess") || normalized.includes("moderate") || normalized.includes("pending")) {
    colorClasses = "bg-amber-50 text-amber-800 border-amber-200 font-bold";
  } else if (normalized.includes("healthy") || normalized.includes("optimal") || normalized.includes("high") || normalized.includes("approved") || normalized.includes("active") || normalized.includes("completed")) {
    colorClasses = "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] border leading-none uppercase tracking-wide",
        colorClasses,
        className
      )}
    >
      {status}
    </span>
  );
};
