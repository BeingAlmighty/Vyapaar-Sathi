"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface SalesChartProps {
  data?: Array<{ period: string; sales: number }>;
  height?: number;
}

const defaultSalesData = [
  { period: "Apr", sales: 58000 },
  { period: "May", sales: 62000 },
  { period: "Jun", sales: 65000 },
  { period: "Jul", sales: 64800 },
  { period: "Aug", sales: 52000 },
  { period: "Sep", sales: 48250 },
];

export const SalesChart: React.FC<SalesChartProps> = ({
  data = defaultSalesData,
  height = 260,
}) => {
  return (
    <div className="w-full bg-white p-6 rounded-3xl border border-slate-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Monthly Sales Trend</h3>
          <p className="text-xs text-slate-500 font-medium">Revenue history over recent months</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
          Last 6 Months
        </span>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00BAF2" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00BAF2" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="period" tickLine={false} axisLine={{ stroke: "#CBD5E1" }} tick={{ fontSize: 11, fill: "#64748B" }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickFormatter={(val) => `₹${val / 1000}k`}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Sales"]}
              contentStyle={{
                backgroundColor: "#0F172A",
                borderColor: "#334155",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#FFFFFF", fontWeight: "bold" }}
              labelStyle={{ color: "#94A3B8", fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#002E6E"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
