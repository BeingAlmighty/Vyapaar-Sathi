"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ChatWindow } from "@/components/teammate/ChatWindow";

export default function TeammatePage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            AI Business Teammate Workspace
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Investigate root causes, simulate scenario models, and approve autonomous campaigns.
          </p>
        </div>
      </div>

      <ChatWindow initialQuery={initialQuery} />
    </div>
  );
}
