"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { ProductPerformance } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ProductChartProps {
  products?: ProductPerformance[];
  title?: string;
  type?: "declining" | "top";
  height?: number;
}

export const ProductChart: React.FC<ProductChartProps> = ({
  products = [],
  title = "Product Sales Breakdown",
  type = "top",
  height = 260,
}) => {
  const chartData = products.map((p) => ({
    name: p.name.length > 15 ? `${p.name.substring(0, 15)}...` : p.name,
    sales: p.current_sales,
    growth: p.growth_percent,
  }));

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-paytm-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 font-medium">
            {type === "declining" ? "Products with demand loss" : "Highest revenue generators"}
          </p>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: "#CBD5E1" }} tick={{ fontSize: 10, fill: "#64748B" }} />
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
            />
            <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={type === "declining" ? "#EF4444" : "#002E6E"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
