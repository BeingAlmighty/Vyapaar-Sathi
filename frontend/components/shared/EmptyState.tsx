"use client";

import React from "react";
import { PackageOpen, Sparkles } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText = "Ask Teammate for Suggestions",
  actionHref = "/teammate",
}) => {
  return (
    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-3 my-4">
      <div className="w-12 h-12 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mx-auto">
        <PackageOpen className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{description}</p>
      </div>

      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center space-x-1.5 bg-paytm-navy text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-paytm-darkBlue transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-paytm-cyan" />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
};
