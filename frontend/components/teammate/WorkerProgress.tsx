"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Circle, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkerProgressProps {
  workers: string[];
  isAnalyzing: boolean;
  onComplete?: () => void;
}

export const WorkerProgress: React.FC<WorkerProgressProps> = ({
  workers,
  isAnalyzing,
  onComplete,
}) => {
  const [completedIndexes, setCompletedIndexes] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (!isAnalyzing || workers.length === 0) {
      setCompletedIndexes(workers.map((_, i) => i));
      setActiveIndex(-1);
      return;
    }

    setCompletedIndexes([]);
    setActiveIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      setCompletedIndexes((prev) => [...prev, current]);
      current++;
      setActiveIndex(current);

      if (current >= workers.length) {
        clearInterval(interval);
        setActiveIndex(-1);
        if (onComplete) onComplete();
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isAnalyzing, workers, onComplete]);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-800 shadow-paytm-card space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-paytm-cyan animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {isAnalyzing ? "Autonomous Multi-Worker Investigation" : "Workers Activated"}
          </span>
        </div>
        <span className="text-[10px] bg-paytm-cyan/20 text-paytm-cyan font-semibold px-2 py-0.5 rounded">
          Agentic Workflow
        </span>
      </div>

      <div className="space-y-2">
        {/* Step 0: Question Understanding */}
        <div className="flex items-center space-x-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium">Understanding intent & context</span>
        </div>

        {/* Dynamic Worker Items */}
        {workers.map((workerName, idx) => {
          const isDone = completedIndexes.includes(idx);
          const isActive = activeIndex === idx;

          return (
            <div
              key={workerName}
              className={cn(
                "flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all",
                isDone
                  ? "bg-slate-800/60 text-slate-300"
                  : isActive
                  ? "bg-paytm-navy/80 text-white font-semibold ring-1 ring-paytm-cyan/50"
                  : "bg-slate-950/40 text-slate-500"
              )}
            >
              <div className="flex items-center space-x-2.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-paytm-cyan animate-spin shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                )}
                <span>{workerName}</span>
              </div>

              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  isDone
                    ? "text-emerald-400"
                    : isActive
                    ? "text-paytm-cyan animate-pulse"
                    : "text-slate-600"
                )}
              >
                {isDone ? "Completed" : isActive ? "Investigating..." : "Pending"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
