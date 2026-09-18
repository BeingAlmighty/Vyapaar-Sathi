"use client";

import React from "react";
import { ChatVisual } from "@/types";
import { SalesChart } from "@/components/charts/SalesChart";
import { ProductChart } from "@/components/charts/ProductChart";
import { RetentionChart } from "@/components/charts/RetentionChart";
import { MetricCard } from "@/components/dashboard/MetricCard";

interface VisualRendererProps {
  visuals?: ChatVisual[];
}

export const VisualRenderer: React.FC<VisualRendererProps> = ({ visuals }) => {
  if (!visuals || visuals.length === 0) return null;

  return (
    <div className="space-y-4 my-3">
      {visuals.map((visual, idx) => {
        if (visual.type === "line_chart") {
          const payload = visual.payload as {
            title?: string;
            series?: Array<{ period: string; sales: number }>;
          };
          return (
            <div key={idx} className="my-2">
              <SalesChart data={payload?.series} height={200} />
            </div>
          );
        }

        if (visual.type === "bar_chart") {
          const payload = visual.payload as {
            title?: string;
            items?: Array<{ name: string; drop: number; sales: number }>;
          };
          const formattedProducts = (payload?.items || []).map((item, i) => ({
            product_id: i + 999,
            name: item.name,
            category: "General",
            price: 100,
            current_sales: item.sales,
            previous_sales: item.sales * 1.3,
            growth_percent: item.drop,
            quantity_sold: Math.round(item.sales / 100),
          }));
          return (
            <div key={idx} className="my-2">
              <ProductChart
                products={formattedProducts}
                title={payload?.title || "Declining Items Analysis"}
                type="declining"
                height={200}
              />
            </div>
          );
        }

        if (visual.type === "pie_chart") {
          return (
            <div key={idx} className="my-2">
              <RetentionChart height={200} />
            </div>
          );
        }

        if (visual.type === "metric_card") {
          const payload = visual.payload as {
            title?: string;
            value?: string;
            change?: string;
          };
          return (
            <div key={idx} className="my-2 max-w-sm">
              <MetricCard
                title={payload?.title || "Key Insight Metric"}
                value={payload?.value || "₹0"}
                subtitle={payload?.change || "System metric"}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
