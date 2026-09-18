"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ForecastChartProps {
  height?: number;
}

const forecastData = [
  { day: "Mon", actual: 42, forecast: 40 },
  { day: "Tue", actual: 38, forecast: 39 },
  { day: "Wed", actual: 45, forecast: 44 },
  { day: "Thu", actual: 50, forecast: 48 },
  { day: "Fri", actual: null, forecast: 65 },
  { day: "Sat", actual: null, forecast: 78 },
  { day: "Sun", actual: null, forecast: 70 },
];

export const ForecastChart: React.FC<ForecastChartProps> = ({ height = 240 }) => {
  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-paytm-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">7-Day Demand Forecast vs Stock</h3>
          <p className="text-xs text-slate-500 font-medium">Predictive ML worker output</p>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="day" tickLine={false} axisLine={{ stroke: "#CBD5E1" }} tick={{ fontSize: 11, fill: "#64748B" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                borderColor: "#334155",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "12px",
              }}
            />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "11px" }} />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Orders"
              stroke="#002E6E"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Forecasted Orders"
              stroke="#00BAF2"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
