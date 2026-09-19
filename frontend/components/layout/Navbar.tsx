"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Menu,
  Building2,
} from "lucide-react";
import { ChatLanguage } from "@/types";

interface NavbarProps {
  onMobileNavToggle?: () => void;
  selectedLanguage?: ChatLanguage;
  onLanguageChange?: (lang: ChatLanguage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMobileNavToggle,
}) => {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Executive Business Dashboard";
      case "/teammate":
        return "AI Business Teammate Workspace";
      case "/inventory":
        return "Inventory Risk Intelligence";
      case "/products":
        return "Product & Sales Intelligence";
      case "/customers":
        return "Customer Retention Intelligence";
      case "/promotions":
        return "Promotions & Campaign ROI";
      case "/campaigns":
        return "Autonomous Campaign Management";
      default:
        return "Vyapaar Sathi - Business OS";
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left section: Mobile menu & Context title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMobileNavToggle}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900 tracking-tight">
                {getPageTitle()}
              </span>
            </div>
          </div>

          {/* Right section: System Status, Language Switcher, AI Action & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Quick Ask AI Teammate button */}
            <Link
              href="/teammate"
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                pathname === "/teammate"
                  ? "bg-paytm-navy text-white shadow-xs"
                  : "bg-paytm-navy text-white hover:bg-paytm-darkBlue shadow-xs"
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-paytm-cyan" />
              <span>Ask Teammate</span>
            </Link>

            {/* Merchant profile badge */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-paytm-navy flex items-center justify-center font-bold text-xs shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-paytm-navy" />
              </div>
              <div className="hidden xl:block text-left">
                <span className="text-xs font-semibold text-slate-900 block leading-tight">
                  Rajesh Fast Food
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">Merchant #1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
