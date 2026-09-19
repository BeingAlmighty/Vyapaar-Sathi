"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Zap,
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

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <LayoutDashboard
          className={cn(
            "h-5 w-5 flex-shrink-0 transition-colors",
            pathname === "/dashboard" ? "text-paytm-cyan" : "text-neutral-400 group-hover/sidebar:text-white"
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
            pathname === "/teammate" ? "text-paytm-cyan" : "text-neutral-400 group-hover/sidebar:text-white"
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
            pathname === "/inventory" ? "text-paytm-cyan" : "text-neutral-400 group-hover/sidebar:text-white"
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
            pathname === "/products" ? "text-paytm-cyan" : "text-neutral-400 group-hover/sidebar:text-white"
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
            pathname === "/customers" ? "text-paytm-cyan" : "text-neutral-400 group-hover/sidebar:text-white"
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
            pathname === "/promotions" ? "text-paytm-cyan" : "text-neutral-400 group-hover/sidebar:text-white"
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
            pathname === "/campaigns" ? "text-paytm-cyan" : "text-neutral-400 group-hover/sidebar:text-white"
          )}
        />
      ),
    },
  ];

  return (
    <SidebarBody
      className={cn(
        "justify-between gap-6 bg-slate-900 border-r border-slate-800 text-slate-200 h-screen sticky top-0 min-h-screen z-40 py-5 px-3 font-sans overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Brand Logo Header */}
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2.5 py-1 mb-6 text-white font-sans transition-all overflow-hidden"
          )}
        >
          <VyapaarSathiLogo className="h-7 w-7 flex-shrink-0" />
          <motion.span
            animate={{
              display: open ? "inline-block" : "none",
              opacity: open ? 1 : 0,
            }}
            className="font-bold text-sm text-white tracking-tight whitespace-nowrap overflow-hidden inline-block !p-0 !m-0"
          >
            Vyapaar Sathi
          </motion.span>
        </Link>

        {/* Links Navigation */}
        <div className="flex flex-col gap-2">
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
      </div>

      {/* Profile Footer */}
      <div className="border-t border-slate-800 pt-3 font-sans overflow-hidden">
        <SidebarLink
          link={{
            label: "Rajesh Fast Food",
            href: "/teammate",
            icon: (
              <div className="h-7 w-7 rounded-full bg-paytm-navy border border-paytm-cyan/30 flex items-center justify-center text-paytm-cyan font-bold text-xs shrink-0 shadow-sm">
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

export const Sidebar = AppSidebar;
