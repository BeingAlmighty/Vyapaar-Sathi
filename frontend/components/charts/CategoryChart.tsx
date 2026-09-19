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

interface CategoryChartProps {
  height?: number;
}

const categoryData = [
  { name: "Pizza", value: 21780, color: "#002E6E" },
  { name: "South Indian", value: 14300, color: "#00BAF2" },
  { name: "Beverages", value: 20000, color: "#10B981" },
  { name: "Burgers", value: 7560, color: "#EF4444" },
  { name: "Rolls", value: 2970, color: "#F59E0B" },
];

export const CategoryChart: React.FC<CategoryChartProps> = ({ height = 240 }) => {
  return (
    <div className="w-full bg-white p-6 rounded-3xl border border-slate-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Revenue Contribution by Category</h3>
          <p className="text-xs text-slate-500 font-medium">Sales share across product lines</p>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={70}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {categoryData.map((entry, index) => (
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
              itemStyle={{ color: "#FFFFFF", fontWeight: "bold" }}
              labelStyle={{ color: "#94A3B8", fontWeight: "bold" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
