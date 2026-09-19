"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, UserMinus, UserCheck, Shield, ArrowRight } from "lucide-react";
import { getCustomerRetention, getAtRiskCustomers } from "@/lib/api/client";
import { RetentionChart } from "@/components/charts/RetentionChart";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function CustomersPage() {
  const merchantId = 1;

  const retentionQuery = useQuery({
    queryKey: ["customer-retention", merchantId],
    queryFn: () => getCustomerRetention(merchantId),
  });

  const atRiskQuery = useQuery({
    queryKey: ["at-risk-customers", merchantId],
    queryFn: () => getAtRiskCustomers(merchantId, 30),
  });

  if (retentionQuery.isLoading || atRiskQuery.isLoading) {
    return <TableSkeleton />;
  }

  if (retentionQuery.isError || atRiskQuery.isError || !retentionQuery.data || !atRiskQuery.data) {
    return (
      <ErrorState
        title="Unable to load customer metrics"
        message="Backend endpoint /api/customers/retention or /api/customers/at-risk failed to respond."
        onRetry={() => {
          retentionQuery.refetch();
          atRiskQuery.refetch();
        }}
      />
    );
  }

  const metrics = retentionQuery.data;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Customer Retention & Re-engagement
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Privacy-conscious customer cohort analytics & automated winback targeting.
          </p>
        </div>

        <Link
          href="/teammate?query=Suggest%20a%20winback%20promotion%20for%2024%20inactive%20customers"
          className="inline-flex items-center space-x-2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-xs shrink-0"
        >
          <span>Launch Inactive Winback Offer</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Customers
          </span>
          <div className="text-2xl font-extrabold text-slate-900">{metrics.total_customers}</div>
          <span className="text-xs text-slate-500">{metrics.new_customers} new this month</span>
        </div>

        <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Returning Rate
          </span>
          <div className="text-2xl font-extrabold text-emerald-600">
            {metrics.repeat_purchase_rate}%
          </div>
          <span className="text-xs text-emerald-700">{metrics.returning_customers} loyal customers</span>
        </div>

        <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Inactive (30+ Days)
          </span>
          <div className="text-2xl font-extrabold text-amber-600">
            {metrics.inactive_customers_count}
          </div>
          <span className="text-xs text-amber-800">Target for re-engagement</span>
        </div>

        <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            High At-Risk Count
          </span>
          <div className="text-2xl font-extrabold text-rose-600">
            {metrics.at_risk_customers_count}
          </div>
          <span className="text-xs text-rose-700">60+ days without order</span>
        </div>
      </div>

      {/* Grid: Chart & At-Risk Customer Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <RetentionChart metrics={metrics} height={260} />
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200/70 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-200/70 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserMinus className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                At-Risk Customer Cohort (30+ Days Inactive)
              </h3>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-200/80 text-slate-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3 text-slate-500" /> Masked Privacy Mode
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200/70 uppercase text-[10px]">
                  <th className="p-4">Customer Reference</th>
                  <th className="p-4">Days Inactive</th>
                  <th className="p-4">Last Order</th>
                  <th className="p-4">Orders</th>
                  <th className="p-4">Total Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {atRiskQuery.data.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      <div>{cust.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{cust.phone}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900">
                        {cust.days_inactive} days
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{cust.last_order_date ? formatDate(cust.last_order_date) : "N/A"}</td>
                    <td className="p-4 font-bold text-slate-800">{cust.total_orders}</td>
                    <td className="p-4 font-extrabold text-slate-900">{formatCurrency(cust.total_spend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
