"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Bot, Globe, ShieldCheck, RefreshCw } from "lucide-react";
import { ChatMessage, MessageItem } from "@/components/teammate/ChatMessage";
import { ChatInput } from "@/components/teammate/ChatInput";
import { SuggestedPrompt } from "@/components/teammate/SuggestedPrompt";
import { WorkerProgress } from "@/components/teammate/WorkerProgress";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { ApprovalModal } from "@/components/shared/ApprovalModal";
import { ChatLanguage, ChatRequest } from "@/types";
import { sendChatMessage } from "@/lib/api/client";
import { ALL_WORKERS, SUGGESTED_PROMPTS } from "@/lib/constants";

interface ChatWindowProps {
  initialQuery?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ initialQuery }) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Namaste Rajesh ji! Main aapka Autonomous Growth Teammate hoon. Main aapke business ka 24/7 analysis karta hoon.\n\nAapki sales pichle month 25.54% gir chuki hai. Aaiye investigate karte hain!",
      language: "hinglish",
      workers: [],
      suggestions: [
        "Why are my sales falling?",
        "Which products are declining?",
        "What should I restock?",
        "Suggest a winback promotion for 24 inactive customers",
      ],
    },
  ]);

  const [selectedLanguage, setSelectedLanguage] = useState<ChatLanguage>("hinglish");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeWorkerList, setActiveWorkerList] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(SUGGESTED_PROMPTS);
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number>(501);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, activeWorkerList]);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (userText: string) => {
    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      language: selectedLanguage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setActiveWorkerList(ALL_WORKERS);

    try {
      const chatReq: ChatRequest = {
        merchant_id: 1,
        message: userText,
        language: selectedLanguage,
      };

      const response = await sendChatMessage(chatReq);

      const aiMsg: MessageItem = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: response.message,
        language: response.language,
        workers: response.workers || ALL_WORKERS,
        visuals: response.visuals,
        suggestions: response.suggestions,
        recommendation: userText.toLowerCase().includes("combo") || userText.toLowerCase().includes("promotion") || userText.toLowerCase().includes("inactive") ? {
          title: "Burger + Cold Coffee Combo Offer",
          regularPrice: 200,
          suggestedPrice: 149,
          expectedBenefit: "Clear excess Cold Coffee inventory & revive Veg Supreme Burger sales",
          reason: "Veg Supreme Burger and Cold Coffee are top cross-selling pairs. Bundling at ₹149 yields estimated revenue boost.",
          campaignId: 501,
        } : undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      }
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsLoading(false);
      setActiveWorkerList([]);
    }
  };

  const handleApproveCampaign = (campaignId?: number) => {
    if (campaignId) setSelectedCampaignId(campaignId);
    setShowApprovalModal(true);
  };

  const handleCampaignApprovedSuccess = () => {
    setMessages((prev) =>
      prev.map((m) =>
        m.recommendation ? { ...m, isApproved: true } : m
      )
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-slate-50 border border-slate-200 rounded-2xl shadow-paytm-card overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-paytm-navy text-white flex items-center justify-center font-bold shadow-sm">
            <Bot className="w-5 h-5 text-paytm-cyan" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900">Vyapaar Sathi AI Companion</h2>
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>Online</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Autonomous multi-agent business OS • Merchant #1
            </p>
          </div>
        </div>

        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onApproveCampaign={handleApproveCampaign}
            onReviewCampaign={() => setShowApprovalModal(true)}
          />
        ))}

        {/* Live worker investigation visualization */}
        {isLoading && (
          <div className="my-4">
            <WorkerProgress workers={activeWorkerList} isAnalyzing={true} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Contextual Suggestions & Input */}
      <div className="p-3 bg-white border-t border-slate-200 space-y-3">
        <SuggestedPrompt
          prompts={suggestions}
          onSelectPrompt={handleSendMessage}
        />

        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </div>

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        campaignId={selectedCampaignId}
        onSuccess={handleCampaignApprovedSuccess}
      />
    </div>
  );
};
