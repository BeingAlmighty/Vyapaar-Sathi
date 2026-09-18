"use client";

import React from "react";

export const MetricCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 animate-pulse">
    <div className="h-3 bg-slate-200 rounded w-1/3" />
    <div className="h-7 bg-slate-200 rounded w-2/3" />
    <div className="h-3 bg-slate-100 rounded w-1/2" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 animate-pulse">
    <div className="flex justify-between">
      <div className="h-4 bg-slate-200 rounded w-1/4" />
      <div className="h-4 bg-slate-100 rounded w-1/6" />
    </div>
    <div className="h-48 bg-slate-100 rounded-lg w-full" />
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 animate-pulse">
    <div className="h-4 bg-slate-200 rounded w-1/5 mb-4" />
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="h-4 bg-slate-200 rounded w-1/6" />
      </div>
    ))}
  </div>
);

export const ChatSkeleton = () => (
  <div className="space-y-4 p-4 animate-pulse">
    <div className="flex space-x-3">
      <div className="w-8 h-8 bg-slate-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-16 bg-slate-100 rounded-xl w-3/4" />
      </div>
    </div>
  </div>
);

export const WorkerProgressSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 animate-pulse">
    <div className="h-4 bg-slate-800 rounded w-1/3" />
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-6 bg-slate-800/60 rounded w-full" />
      ))}
    </div>
  </div>
);
