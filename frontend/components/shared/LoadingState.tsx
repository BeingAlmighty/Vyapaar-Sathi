"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading live business intelligence...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 min-h-[300px]">
      <Loader2 className="w-8 h-8 text-paytm-cyan animate-spin" />
      <p className="text-xs font-semibold text-slate-600">{message}</p>
    </div>
  );
};
