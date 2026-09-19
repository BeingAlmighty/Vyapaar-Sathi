"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatWindow } from "@/components/teammate/ChatWindow";

function TeammateContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || undefined;

  return <ChatWindow initialQuery={initialQuery} />;
}

export default function TeammatePage() {
  return (
    <div className="space-y-4 font-sans">
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

      <Suspense fallback={
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm h-[600px] flex items-center justify-center text-slate-400 text-sm">
          Loading AI Teammate Workspace...
        </div>
      }>
        <TeammateContent />
      </Suspense>
    </div>
  );
}
