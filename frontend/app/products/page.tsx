"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, TrendingUp, TrendingDown, Sparkles, ArrowRight } from "lucide-react";
import { getTopProducts, getDecliningProducts } from "@/lib/api/client";
import { ProductChart } from "@/components/charts/ProductChart";
import { CategoryChart } from "@/components/charts/CategoryChart";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatCurrency, formatPercent } from "@/lib/utils";
import Link from "next/link";

export default function ProductsPage() {
  const merchantId = 1;

  const topQuery = useQuery({
    queryKey: ["products-top", merchantId],
    queryFn: () => getTopProducts(merchantId, 5),
  });

  const decliningQuery = useQuery({
    queryKey: ["products-declining", merchantId],
    queryFn: () => getDecliningProducts(merchantId, 5),
  });

  if (topQuery.isLoading || decliningQuery.isLoading) {
    return <TableSkeleton />;
  }

  if (topQuery.isError || decliningQuery.isError || !topQuery.data || !decliningQuery.data) {
    return (
      <ErrorState
        title="Unable to load product intelligence"
        message="Endpoints at /api/products/top or /api/products/declining failed to respond."
        onRetry={() => {
          topQuery.refetch();
          decliningQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Product Intelligence & Demand Analytics
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Identify your top revenue drivers and products experiencing demand drop.
          </p>
        </div>

        <Link
          href="/teammate?query=Which%20products%20should%20I%20promote%3F"
          className="inline-flex items-center space-x-2 bg-paytm-navy text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-paytm-darkBlue transition-all shadow-sm shrink-0"
        >
          <Sparkles className="w-4 h-4 text-paytm-cyan" />
          <span>Ask Teammate For Promotion Ideas</span>
        </Link>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductChart
          products={decliningQuery.data}
          title="Products Losing Demand"
          type="declining"
          height={260}
        />
        <CategoryChart height={260} />
      </div>

      {/* Tables Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-paytm-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Top Selling Products
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              High Growth
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {topQuery.data.map((prod) => (
              <div key={prod.product_id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{prod.name}</h4>
                  <span className="text-[11px] text-slate-500">{prod.category} • {prod.quantity_sold} sold</span>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-slate-900">{formatCurrency(prod.current_sales)}</div>
                  <div className="text-emerald-600 font-bold text-[11px]">
                    {formatPercent(prod.growth_percent)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Declining Products */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-paytm-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Products Losing Demand
              </h3>
            </div>
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
              Decline Risk
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {decliningQuery.data.map((prod) => (
              <div key={prod.product_id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{prod.name}</h4>
                  <span className="text-[11px] text-slate-500">{prod.category} • {prod.quantity_sold} sold</span>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-slate-900">{formatCurrency(prod.current_sales)}</div>
                  <div className="text-red-600 font-bold text-[11px]">
                    {formatPercent(prod.growth_percent)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
