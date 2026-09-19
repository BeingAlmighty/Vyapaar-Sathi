"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  LayoutDashboard,
  Bot,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VyapaarSathiLogo } from "@/components/shared/VyapaarSathiLogo";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Teammate", href: "/teammate", icon: Bot },
  { name: "Inventory Risk", href: "/inventory", icon: Package },
  { name: "Products", href: "/products", icon: ShoppingBag },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Promotions", href: "/promotions", icon: Tag },
  { name: "Autonomous Campaigns", href: "/campaigns", icon: Zap },
];

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-white shadow-2xl p-4 flex flex-col justify-between z-50">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <VyapaarSathiLogo className="w-6 h-6" />
              <span className="font-bold text-sm text-white tracking-tight">
                Vyapaar Sathi
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors",
                    isActive
                      ? "bg-paytm-navy text-white font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-paytm-cyan" : "text-slate-400"
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 bg-slate-800/80 rounded-xl text-xs text-slate-300">
          <span className="font-semibold text-white block mb-0.5">Rajesh Fast Food</span>
          <span className="text-[10px] text-slate-400 block">Merchant ID: 1</span>
        </div>
      </div>
    </div>
  );
};
