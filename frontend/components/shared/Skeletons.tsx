"use client";

import React from "react";

export const DashboardHeroSkeleton = () => (
  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
    <div className="space-y-3 flex-1">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 bg-paytm-cyan/30 rounded" />
        <div className="h-3 bg-slate-200/80 rounded w-48" />
      </div>
      <div className="h-6 bg-slate-200 rounded w-64" />
      <div className="h-3 bg-slate-100 rounded w-80" />
    </div>
    <div className="h-10 bg-slate-100 border border-slate-200 rounded-xl w-44 shrink-0" />
  </div>
);

export const MetricCardSkeleton = () => (
  <div className="bg-white border border-slate-200/80 rounded-xl p-5 space-y-3 animate-pulse shadow-xs">
    <div className="flex justify-between items-center">
      <div className="h-3.5 bg-slate-200/80 rounded w-28" />
      <div className="h-7 w-7 bg-slate-100 rounded-lg" />
    </div>
    <div className="h-7 bg-slate-200 rounded w-36" />
    <div className="h-3 bg-slate-100 rounded w-24" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white border border-slate-200/80 rounded-xl p-6 space-y-4 animate-pulse shadow-xs font-sans">
    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
      <div className="space-y-1.5">
        <div className="h-4 bg-slate-200 rounded w-44" />
        <div className="h-3 bg-slate-100 rounded w-32" />
      </div>
      <div className="h-7 bg-slate-100 rounded-lg w-28" />
    </div>
    <div className="h-56 bg-slate-50 border border-slate-100 rounded-xl w-full flex items-end p-4 gap-3">
      <div className="h-1/3 bg-slate-200/60 rounded-t w-full" />
      <div className="h-2/3 bg-slate-200/80 rounded-t w-full" />
      <div className="h-1/2 bg-slate-200/60 rounded-t w-full" />
      <div className="h-3/4 bg-paytm-cyan/20 rounded-t w-full" />
      <div className="h-2/5 bg-slate-200/60 rounded-t w-full" />
      <div className="h-4/5 bg-slate-200/80 rounded-t w-full" />
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-white border border-slate-200/80 rounded-xl p-5 space-y-3 animate-pulse shadow-xs">
    <div className="h-4 bg-slate-200 rounded w-40 mb-4" />
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100">
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 bg-slate-200 rounded w-1/3" />
          <div className="h-2.5 bg-slate-100 rounded w-1/4" />
        </div>
        <div className="h-4 bg-slate-200 rounded w-20" />
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
