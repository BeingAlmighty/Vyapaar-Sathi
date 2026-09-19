"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Sidebar } from "@/components/ui/sidebar";
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
        <title>Vyapaar Sathi - Autonomous AI Business Growth Teammate</title>
        <meta
          name="description"
          content="Autonomous AI business companion for merchants that detects problems, investigates root cause with specialized workers, and executes growth decisions."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen">
        <QueryClientProvider client={queryClient}>
          <Sidebar>
            <div className="flex min-h-screen w-full font-sans">
              <AppSidebar />

              <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50">
                <Navbar
                  onMobileNavToggle={() => setMobileNavOpen(true)}
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                />

                <MobileNav
                  isOpen={mobileNavOpen}
                  onClose={() => setMobileNavOpen(false)}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden font-sans">
                  {children}
                </main>
              </div>
            </div>
          </Sidebar>
        </QueryClientProvider>
      </body>
    </html>
  );
}
