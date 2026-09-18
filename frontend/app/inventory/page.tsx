"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, RefreshCw } from "lucide-react";
import { getInventoryRisk } from "@/lib/api/client";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { ErrorState } from "@/components/shared/ErrorState";
import Link from "next/link";

export default function InventoryPage() {
  const merchantId = 1;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["inventory", merchantId],
    queryFn: () => getInventoryRisk(merchantId),
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load inventory intelligence"
        message="Backend at /api/inventory/risk/1 returned an error or is unavailable."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Inventory Risk & Stock Intelligence
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Monitor real-time ingredient levels, stockout threats, and excess holding cost.
          </p>
        </div>

        <Link
          href="/teammate?query=What%20should%20I%20restock%3F"
          className="inline-flex items-center space-x-2 bg-paytm-navy text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-paytm-darkBlue transition-all shadow-sm shrink-0"
        >
          <Sparkles className="w-4 h-4 text-paytm-cyan" />
          <span>Ask Teammate to Audit Inventory</span>
        </Link>
      </div>

      {/* Inventory Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-700 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-800">
              Low Stock Alert
            </span>
            <div className="text-2xl font-extrabold text-red-950 mt-0.5">
              {data.low_stock_count} item
            </div>
            <span className="text-[11px] text-red-700 font-medium">Immediate reorder required</span>
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Excess Stock
            </span>
            <div className="text-2xl font-extrabold text-amber-950 mt-0.5">
              {data.excess_stock_count} item
            </div>
            <span className="text-[11px] text-amber-800 font-medium">Overstocked ingredients</span>
          </div>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Healthy Stock
            </span>
            <div className="text-2xl font-extrabold text-emerald-950 mt-0.5">
              {data.items.filter((i) => {
                const s = i.status.toLowerCase().replace(/_/g, " ");
                return s === "healthy" || s === "optimal";
              }).length} items
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Optimal operating levels</span>
          </div>
        </div>
      </div>

      {/* Inventory Items Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-paytm-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-paytm-navy" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Ingredient & Stock Status Table
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {data.items.length} items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                <th className="p-3.5">Product / Ingredient</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Min - Max Level</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Rec. Reorder</th>
                <th className="p-3.5 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.map((item) => {
                const normalizedStatus = item.status.toLowerCase().replace(/_/g, " ");
                const isLowStock = normalizedStatus === "low stock";
                const isExcessStock = normalizedStatus === "excess stock";

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{item.product_name}</td>
                    <td className="p-3.5 text-slate-600 font-medium">{item.category}</td>
                    <td className="p-3.5 font-extrabold text-slate-900">{item.current_stock}</td>
                    <td className="p-3.5 text-slate-500">
                      {item.min_reorder_level} - {item.max_stock_level}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={item.status} type="stock" />
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {item.recommended_reorder_qty > 0 ? (
                        <span className="text-red-600">+{item.recommended_reorder_qty} units</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {isLowStock ? (
                        <Link
                          href="/teammate?query=Create%20supplier%20order%20for%20Burger%20buns"
                          className="inline-flex items-center px-2.5 py-1 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-[11px]"
                        >
                          Restock Now
                        </Link>
                      ) : isExcessStock ? (
                        <Link
                          href="/teammate?query=Create%20combo%20to%20clear%20Cold%20Coffee%20stock"
                          className="inline-flex items-center px-2.5 py-1 bg-paytm-navy text-white font-bold rounded-lg hover:bg-paytm-darkBlue transition-colors text-[11px]"
                        >
                          Create Combo
                        </Link>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Healthy</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
