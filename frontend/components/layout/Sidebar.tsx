"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Bot,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Zap,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const pathname = usePathname();
  const merchantId = 1;

  const { data: res } = useQuery({
    queryKey: ["dashboard", merchantId],
    queryFn: () => api.getDashboard(merchantId),
    staleTime: 10000,
  });

  const dashboardData = res?.data;
  const lowStockCount = dashboardData?.inventory_risk?.low_stock_count ?? 1;
  const inactiveCount = dashboardData?.customer_metrics?.inactive_customers_count ?? 24;
  const warningAlert = dashboardData?.alerts_and_opportunities?.find((a) => a.type === "warning");

  const urgentFocusText = warningAlert
    ? warningAlert.message
    : "Monitoring live business performance.";

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "AI Business Teammate",
      href: "/teammate",
      icon: Bot,
      badge: "AI Active",
      badgeColor: "bg-paytm-cyan text-paytm-navy font-bold",
    },
    {
      name: "Inventory Risk",
      href: "/inventory",
      icon: Package,
      badge: `${lowStockCount} Risk`,
      badgeColor: "bg-red-100 text-red-700 font-bold",
    },
    {
      name: "Product Intelligence",
      href: "/products",
      icon: ShoppingBag,
      badge: null,
    },
    {
      name: "Customer Retention",
      href: "/customers",
      icon: Users,
      badge: `${inactiveCount} Inactive`,
      badgeColor: "bg-amber-100 text-amber-800 font-bold",
    },
    {
      name: "Promotions ROI",
      href: "/promotions",
      icon: Tag,
      badge: null,
    },
    {
      name: "Autonomous Campaigns",
      href: "/campaigns",
      icon: Zap,
      badge: "1 Pending",
      badgeColor: "bg-blue-100 text-paytm-navy font-bold",
    },
  ];

  return (
    <aside
      className={cn(
        "w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-[calc(100vh-4rem)]",
        className
      )}
    >
      {/* Navigation section */}
      <div className="p-4 space-y-6 flex-1">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Business Operating OS
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group",
                    isActive
                      ? "bg-paytm-navy text-white font-semibold shadow-sm ring-1 ring-paytm-cyan/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive ? "text-paytm-cyan" : "text-slate-400 group-hover:text-slate-300"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge ? (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold leading-none",
                        item.badgeColor
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Insights Summary Box (Dynamic Data) */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" /> Urgent Focus
            </span>
            <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">
              Merchant #{merchantId}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            {urgentFocusText}
          </p>
          <Link
            href="/teammate"
            className="block text-center text-[11px] font-semibold bg-paytm-cyan/10 text-paytm-cyan border border-paytm-cyan/30 py-1.5 rounded-md hover:bg-paytm-cyan hover:text-paytm-navy transition-all"
          >
            Investigate Root Cause →
          </Link>
        </div>
      </div>

      {/* Footer / Operating Teammate Status */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-paytm-cyan/20 border border-paytm-cyan/40 text-paytm-cyan flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
          <div className="text-left text-xs">
            <div className="font-semibold text-white flex items-center gap-1">
              Autonomous Agent
            </div>
            <div className="text-[10px] text-slate-400">Monitoring 24/7</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
