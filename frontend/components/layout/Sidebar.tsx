"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Zap,
  AlertTriangle,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import { VyapaarSathiLogo } from "@/components/shared/VyapaarSathiLogo";

export const AppSidebar: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();
  const { open } = useSidebar();
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
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <LayoutDashboard
          className={cn(
            "h-5 w-5 flex-shrink-0 transition-colors",
            pathname === "/dashboard" ? "text-paytm-cyan" : "text-slate-400 group-hover/sidebar:text-slate-200"
          )}
        />
      ),
    },
    {
      label: "AI Teammate",
      href: "/teammate",
      icon: (
        <Bot
          className={cn(
            "h-5 w-5 flex-shrink-0 transition-colors",
            pathname === "/teammate" ? "text-paytm-cyan" : "text-slate-400 group-hover/sidebar:text-slate-200"
          )}
        />
      ),
    },
    {
      label: `Inventory Risk (${lowStockCount})`,
      href: "/inventory",
      icon: (
        <Package
          className={cn(
            "h-5 w-5 flex-shrink-0 transition-colors",
            pathname === "/inventory" ? "text-paytm-cyan" : "text-slate-400 group-hover/sidebar:text-slate-200"
          )}
        />
      ),
    },
    {
      label: "Product Intelligence",
      href: "/products",
      icon: (
        <ShoppingBag
          className={cn(
            "h-5 w-5 flex-shrink-0 transition-colors",
            pathname === "/products" ? "text-paytm-cyan" : "text-slate-400 group-hover/sidebar:text-slate-200"
          )}
        />
      ),
    },
    {
      label: `Customer Retention (${inactiveCount})`,
      href: "/customers",
      icon: (
        <Users
          className={cn(
            "h-5 w-5 flex-shrink-0 transition-colors",
            pathname === "/customers" ? "text-paytm-cyan" : "text-slate-400 group-hover/sidebar:text-slate-200"
          )}
        />
      ),
    },
    {
      label: "Promotions ROI",
      href: "/promotions",
      icon: (
        <Tag
          className={cn(
            "h-5 w-5 flex-shrink-0 transition-colors",
            pathname === "/promotions" ? "text-paytm-cyan" : "text-slate-400 group-hover/sidebar:text-slate-200"
          )}
        />
      ),
    },
    {
      label: "Autonomous Campaigns",
      href: "/campaigns",
      icon: (
        <Zap
          className={cn(
            "h-5 w-5 flex-shrink-0 transition-colors",
            pathname === "/campaigns" ? "text-paytm-cyan" : "text-slate-400 group-hover/sidebar:text-slate-200"
          )}
        />
      ),
    },
  ];

  return (
    <SidebarBody
      className={cn(
        "justify-between gap-6 bg-slate-900 border-r border-slate-800 text-slate-200 h-screen sticky top-0 min-h-screen z-40 py-5 px-2.5 font-sans overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Brand Header */}
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 py-2 px-1 mb-6 text-white font-sans transition-all overflow-hidden",
            open ? "justify-start" : "justify-center"
          )}
        >
          <div className="shrink-0 flex items-center justify-center">
            <VyapaarSathiLogo className="w-9 h-9 shrink-0" />
          </div>
          <motion.div
            initial={false}
            animate={{
              opacity: open ? 1 : 0,
              width: open ? "auto" : 0,
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            className="whitespace-nowrap overflow-hidden"
          >
            <span className="font-bold text-sm text-white tracking-tight block leading-tight">
              Vyapaar Sathi
            </span>
            <span className="text-[10px] text-slate-400 font-medium block">
              Autonomous Business OS
            </span>
          </motion.div>
        </Link>

        {/* Links Navigation */}
        <div className="flex flex-col gap-1.5">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <SidebarLink
                key={idx}
                link={item}
                className={cn(
                  "px-2 py-2 rounded-xl transition-all font-sans text-xs font-medium",
                  isActive
                    ? "bg-slate-800 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                )}
              />
            );
          })}
        </div>

        {/* Quick Insights Summary Box (visible when expanded) */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="mt-6 bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 space-y-2 font-sans overflow-hidden shrink-0"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" /> Urgent Focus
                </span>
                <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">
                  Merchant #1
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {urgentFocusText}
              </p>
              <Link
                href="/teammate"
                className="block text-center text-[11px] font-semibold bg-paytm-cyan/10 text-paytm-cyan border border-paytm-cyan/30 py-1 rounded-md hover:bg-paytm-cyan hover:text-paytm-navy transition-all"
              >
                Investigate Root Cause
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Footer */}
      <div className="border-t border-slate-800 pt-4 font-sans overflow-hidden">
        <SidebarLink
          link={{
            label: "Rajesh Fast Food",
            href: "/teammate",
            icon: (
              <div className="h-8 w-8 rounded-full bg-paytm-navy border border-paytm-cyan/30 flex items-center justify-center text-paytm-cyan font-bold text-xs shrink-0 shadow-sm">
                <Building2 className="w-4 h-4" />
              </div>
            ),
          }}
          className="hover:bg-slate-800/60 rounded-xl px-1 py-1 text-xs font-medium text-slate-200"
        />
      </div>
    </SidebarBody>
  );
};

// Re-export as Sidebar for backwards compatibility if needed
export const Sidebar = AppSidebar;
