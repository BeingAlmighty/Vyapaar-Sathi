"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Menu,
  Activity,
  UserCheck,
  ChevronDown,
  Globe,
  Database,
  Cpu,
  Workflow,
  Server,
} from "lucide-react";
import { isDemoModeActive, subscribeDemoMode, getHealth } from "@/lib/api/client";
import { ChatLanguage, HealthStatus } from "@/types";

interface NavbarProps {
  onMobileNavToggle?: () => void;
  selectedLanguage?: ChatLanguage;
  onLanguageChange?: (lang: ChatLanguage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMobileNavToggle,
  selectedLanguage = "hinglish",
  onLanguageChange,
}) => {
  const pathname = usePathname();
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [showHealthPopover, setShowHealthPopover] = useState<boolean>(false);

  useEffect(() => {
    setIsDemo(isDemoModeActive());
    const unsubscribe = subscribeDemoMode((demoState) => {
      setIsDemo(demoState);
    });

    getHealth().then(setHealth).catch(() => {});

    return () => unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-paytm-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Logo & Mobile menu button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMobileNavToggle}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="bg-paytm-navy text-white font-extrabold text-xl px-2.5 py-1 rounded-md tracking-tight flex items-center shadow-sm">
                Paytm
                <span className="bg-paytm-cyan text-paytm-navy text-xs font-bold ml-1.5 px-1.5 py-0.5 rounded">
                  AI OS
                </span>
              </div>
              <div className="hidden md:block">
                <span className="text-sm font-semibold text-slate-900 block leading-none">
                  Autonomous Growth Teammate
                </span>
                <span className="text-xs text-slate-500 font-medium leading-tight">
                  Merchant OS • Hackathon Edition
                </span>
              </div>
            </Link>
          </div>

          {/* Right section: Health indicator, Language switcher, AI shortcut & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* System / Demo Health Status Badge */}
            <div className="relative">
              <button
                onClick={() => setShowHealthPopover(!showHealthPopover)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                  isDemo
                    ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                    : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isDemo ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                />
                <span>{isDemo ? "Demo Data" : "System Healthy"}</span>
                <Activity className="w-3.5 h-3.5 ml-0.5 opacity-70" />
              </button>

              {/* Health Popover Details */}
              {showHealthPopover && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-paytm-lg p-3 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="font-semibold text-slate-900 border-b pb-1.5 mb-2 flex items-center justify-between">
                    <span>System Services Health</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isDemo ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {isDemo ? "Demo Mode" : "Live API"}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-slate-400" /> FastAPI Backend
                      </span>
                      <span className={`font-medium ${isDemo ? "text-amber-600" : "text-emerald-600"}`}>
                        {health?.api || (isDemo ? "Offline (Fallback)" : "Healthy")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-slate-400" /> PostgreSQL DB
                      </span>
                      <span className="font-medium text-emerald-600">
                        {health?.database || health?.services?.database || "Connected"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Workflow className="w-3.5 h-3.5 text-slate-400" /> n8n Workflows
                      </span>
                      <span className="font-medium text-emerald-600">
                        {health?.n8n || health?.services?.n8n || "Ready"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-slate-400" /> Python ML Service
                      </span>
                      <span className="font-medium text-emerald-600">
                        {health?.ml_service || health?.services?.ml_service || "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Multilingual Selector */}
            {onLanguageChange && (
              <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
                <Globe className="w-3.5 h-3.5 ml-1.5 text-slate-500 mr-1" />
                {(["hinglish", "hindi", "english"] as ChatLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange(lang)}
                    className={`px-2 py-0.5 rounded capitalize transition-colors ${
                      selectedLanguage === lang
                        ? "bg-paytm-navy text-white shadow-xs font-semibold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {lang === "hinglish" ? "Hinglish" : lang === "hindi" ? "हिंदी" : "English"}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Ask AI Teammate button */}
            <Link
              href="/teammate"
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname === "/teammate"
                  ? "bg-paytm-navy text-white shadow-sm ring-2 ring-paytm-cyan/50"
                  : "bg-paytm-lightBlue text-paytm-navy hover:bg-paytm-cyan/20 border border-paytm-cyan/30"
              }`}
            >
              <Sparkles className="w-4 h-4 text-paytm-cyan animate-spin-slow" />
              <span>Ask Teammate</span>
            </Link>

            {/* Merchant profile indicator */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-paytm-navy text-white flex items-center justify-center font-bold text-xs shadow-sm">
                RK
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  Rajesh Fast Food
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Merchant #1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
