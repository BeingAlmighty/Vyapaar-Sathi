"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { CustomerMetrics } from "@/types";

interface RetentionChartProps {
  metrics?: CustomerMetrics;
  height?: number;
}

export const RetentionChart: React.FC<RetentionChartProps> = ({
  metrics = {
    total_customers: 60,
    new_customers: 4,
    returning_customers: 36,
    repeat_purchase_rate: 60.0,
    inactive_customers_count: 24,
    at_risk_customers_count: 5,
  },
  height = 240,
}) => {
  const data = [
    { name: "Active Returning", value: metrics.returning_customers, color: "#10B981" },
    { name: "New Customers", value: metrics.new_customers, color: "#00BAF2" },
    { name: "Inactive (30+ days)", value: metrics.inactive_customers_count, color: "#F59E0B" },
  ];

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-paytm-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Customer Base Composition</h3>
          <p className="text-xs text-slate-500 font-medium">Retention vs Inactive Breakdown</p>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                borderColor: "#334155",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "12px",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
