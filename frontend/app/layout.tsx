"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ChatLanguage } from "@/types";
import "./globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<ChatLanguage>("hinglish");

  return (
    <html lang="en">
      <head>
        <title>Paytm Autonomous Merchant Growth Teammate</title>
        <meta
          name="description"
          content="Autonomous AI business teammate for Paytm merchants that detects problems, investigates root cause with specialized workers, and executes decisions."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-slate-50 text-slate-900 flex flex-col min-h-screen">
        <QueryClientProvider client={queryClient}>
          <Navbar
            onMobileNavToggle={() => setMobileNavOpen(true)}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />

          <MobileNav
            isOpen={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
          />

          <div className="flex flex-1 max-w-7xl w-full mx-auto">
            <Sidebar className="hidden lg:block" />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
              {children}
            </main>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
