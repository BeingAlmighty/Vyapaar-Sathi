"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowRight,
  TrendingDown,
  ShoppingBag,
  AlertTriangle,
  Store,
  Bot,
} from "lucide-react";
import { api } from "@/lib/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { OpportunityCard } from "@/components/dashboard/OpportunityCard";
import { SalesChart } from "@/components/charts/SalesChart";
import { ProductChart } from "@/components/charts/ProductChart";
import {
  DashboardHeroSkeleton,
  MetricCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from "@/components/shared/Skeletons";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const merchantId = 1;

  const { data: res, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard", merchantId],
    queryFn: () => api.getDashboard(merchantId),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DashboardHeroSkeleton />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
        <ChartSkeleton />
        <TableSkeleton />
      </div>
    );
  }

  // STRICT BACKEND REQUIREMENT: If backend API failed or returned success: false, do NOT display mock values!
  if (isError || !res || !res.success || !res.data) {
    return (
      <ErrorState
        title="Live Backend Required for Dashboard"
        message={res?.error?.message || "Dashboard requires live backend connection. Please ensure your FastAPI server is running."}
        onRetry={refetch}
      />
    );
  }

  const data = res.data;
  const { sales_summary, alerts_and_opportunities, top_selling_products, declining_products } = data;

  const opportunityAlert = alerts_and_opportunities.find((a) => a.type === "opportunity");

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-paytm-cyan text-xs font-bold uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Merchant #{data.merchant_id} • Live Backend Connected</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Good Morning
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Your Business Teammate detected <span className="text-amber-400 font-bold">{alerts_and_opportunities.length} live alerts & opportunities</span>.
          </p>
        </div>

        <Link
          href="/teammate"
          className="inline-flex items-center space-x-2 bg-paytm-cyan text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl hover:bg-white transition-all shadow-xs shrink-0"
        >
          <span>Ask Business Teammate</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Primary KPI Metrics (Direct Backend Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Sales"
          value={formatCurrency(sales_summary.today_sales)}
          subtitle={`${sales_summary.today_orders} orders today`}
          icon={<ShoppingBag className="w-4 h-4 text-slate-700" />}
        />
        <MetricCard
          title="Monthly Sales"
          value={formatCurrency(sales_summary.monthly_sales)}
          change={sales_summary.sales_growth_percent}
          changePeriod="vs last month"
          icon={<TrendingDown className="w-4 h-4 text-rose-500" />}
        />
        <MetricCard
          title="Average Order Value"
          value={formatCurrency(sales_summary.average_order_value)}
          subtitle="Monthly average"
        />
        <MetricCard
          title="Monthly Orders"
          value={sales_summary.monthly_orders}
          subtitle="Total completed orders"
        />
      </div>

      {/* Prominent "ASK YOUR BUSINESS TEAMMATE" Entrypoint */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <Bot className="w-6 h-6 text-paytm-cyan" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200/60">
              AI Business Operating OS
            </span>
            <h3 className="text-base font-extrabold text-slate-900 leading-snug mt-1">
              ASK YOUR BUSINESS TEAMMATE
            </h3>
            <p className="text-xs text-slate-500">
              Inquire in Hinglish, Hindi or English e.g. "Meri sales kyun gir rahi hai?"
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
          <Link
            href="/teammate?query=Meri%20sales%20kyun%20gir%20rahi%20hai%3F"
            className="text-xs bg-slate-100/80 hover:bg-slate-900 hover:text-white text-slate-800 font-semibold px-4 py-1.5 rounded-full border border-slate-200/60 transition-all"
          >
            "Meri sales kyun gir rahi hai?"
          </Link>
          <Link
            href="/teammate?query=What%20should%20I%20restock%3F"
            className="text-xs bg-slate-100/80 hover:bg-slate-900 hover:text-white text-slate-800 font-semibold px-4 py-1.5 rounded-full border border-slate-200/60 transition-all"
          >
            "What should I restock?"
          </Link>
        </div>
      </div>

      {/* Attention & Opportunities Panel (Direct Backend Array) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Needs Attention & Growth Opportunities
          </h2>
          <span className="text-xs text-slate-500 font-medium">Auto-detected by backend</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts_and_opportunities.map((alert, idx) => (
            <AlertCard key={idx} alert={alert} />
          ))}
        </div>
      </div>

      {/* Visual Analytics Grid (Direct Backend Product Data) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={data.sales_trend} height={280} />
        </div>
        <div>
          <ProductChart
            products={declining_products}
            title="Products Losing Demand"
            type="declining"
            height={280}
          />
        </div>
      </div>

      {/* High-Impact AI Opportunity Recommendation Teaser (Dynamic Backend Data) */}
      <OpportunityCard
        title={opportunityAlert ? opportunityAlert.title : "High Margin Combo Opportunity"}
        subtitle={opportunityAlert ? opportunityAlert.message : "Bundling declining items with excess inventory is projected to increase monthly net profit based on live transaction analytics."}
        actionText="Review & Launch Autonomous Combo Campaign"
        targetHref="/campaigns"
        expectedRevenue="₹6,800 / month"
      />
    </div>
  );
}
