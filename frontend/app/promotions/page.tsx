"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Tag, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import { getPromotions } from "@/lib/api/client";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function PromotionsPage() {
  const merchantId = 1;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["promotions", merchantId],
    queryFn: () => getPromotions(merchantId),
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load promotion metrics"
        message="Backend endpoint /api/promotions/1 returned an error or is unreachable."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Promotions & Campaign ROI Analysis
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Evaluate past campaign performance, incremental revenue, and margin impact.
          </p>
        </div>

        <Link
          href="/teammate?query=How%20are%20my%20promotions%20performing%3F"
          className="inline-flex items-center space-x-2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-xs shrink-0"
        >
          <span>Ask Teammate to Audit Campaigns</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Promotion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((promo) => {
          const isIneffective = promo.effectiveness === "ineffective";

          return (
            <div
              key={promo.id}
              className={`bg-white border rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4 relative ${
                isIneffective ? "border-rose-200/80 bg-rose-50/20" : "border-slate-200/70"
              }`}
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-0.5">
                    {promo.target_category} Category • {promo.discount_percent}% Discount
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">{promo.name}</h3>
                  <span className="text-xs text-slate-400 font-medium">
                    {formatDate(promo.start_date)} - {formatDate(promo.end_date)}
                  </span>
                </div>

                <StatusBadge status={promo.effectiveness} type="effectiveness" />
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/70 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Actual Sales</span>
                  <span className="text-slate-900 font-extrabold text-sm">{formatCurrency(promo.actual_sales)}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Incremental Sales</span>
                  <span className="text-emerald-700 font-extrabold text-sm">{formatCurrency(promo.incremental_sales)}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">ROI</span>
                  <span className={`font-extrabold text-sm ${isIneffective ? "text-rose-600" : "text-emerald-600"}`}>
                    {promo.roi_percent}%
                  </span>
                </div>
              </div>

              {/* Warning box if ineffective */}
              {isIneffective && (
                <div className="bg-rose-50 border border-rose-200/70 p-3.5 rounded-2xl text-xs text-rose-950 flex items-start space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Promotion generated little incremental margin benefit</span>
                    <p className="text-xs text-rose-700 leading-snug mt-0.5">
                      Discounting burgers alone diluted profit margin. Teammate recommends switching to the Burger + Cold Coffee combo.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
