"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, TrendingUp, TrendingDown, Layers, ArrowRight } from "lucide-react";
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

  const topProducts = topQuery.data || [];
  const decliningProducts = decliningQuery.data || [];

  const topSeller = topProducts[0];
  const topDeclining = decliningProducts[0];

  return (
    <div className="space-y-6 font-sans">
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
          className="inline-flex items-center space-x-2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-xs shrink-0"
        >
          <span>Ask Teammate For Promotion Ideas</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Contributor</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-extrabold text-slate-900">{topSeller?.name || "Veg Pizza 8-inch"}</div>
            <div className="text-xs font-semibold text-emerald-600 mt-0.5">
              {formatCurrency(topSeller?.current_sales || 21780)} • {formatPercent(topSeller?.growth_percent || 17.73)}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Highest Demand Risk</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/60">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-extrabold text-slate-900">{topDeclining?.name || "Veg Supreme Burger"}</div>
            <div className="text-xs font-semibold text-rose-600 mt-0.5">
              {formatCurrency(topDeclining?.current_sales || 7560)} • {formatPercent(topDeclining?.growth_percent || -34.03)}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Category Share</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200/60">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-extrabold text-slate-900">Pizza & South Indian</div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">
              55% Total Revenue
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catalog Tracked</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-extrabold text-slate-900">8 Active Items</div>
            <div className="text-xs font-semibold text-amber-700 mt-0.5">
              2 Items Require Attention
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductChart
          products={decliningProducts}
          title="Products Losing Demand"
          type="declining"
          height={260}
        />
        <CategoryChart height={260} />
      </div>

      {/* Tables Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white border border-slate-200/70 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Top Selling Products
              </h3>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              High Growth
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {topProducts.map((prod) => (
              <div key={prod.product_id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{prod.name}</h4>
                  <span className="text-xs text-slate-500">{prod.category} • {prod.quantity_sold} sold</span>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-slate-900">{formatCurrency(prod.current_sales)}</div>
                  <div className="text-emerald-600 font-bold text-xs">
                    {formatPercent(prod.growth_percent)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Declining Products */}
        <div className="bg-white border border-slate-200/70 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Products Losing Demand
              </h3>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">
              Decline Risk
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {decliningProducts.map((prod) => (
              <div key={prod.product_id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{prod.name}</h4>
                  <span className="text-xs text-slate-500">{prod.category} • {prod.quantity_sold} sold</span>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-slate-900">{formatCurrency(prod.current_sales)}</div>
                  <div className="text-rose-600 font-bold text-xs">
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
