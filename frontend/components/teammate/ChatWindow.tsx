"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bot, Trash2 } from "lucide-react";
import { ChatMessage, MessageItem } from "@/components/teammate/ChatMessage";
import { ChatInput } from "@/components/teammate/ChatInput";
import { SuggestedPrompt } from "@/components/teammate/SuggestedPrompt";
import { WorkerProgress } from "@/components/teammate/WorkerProgress";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { ApprovalModal } from "@/components/shared/ApprovalModal";
import { ChatLanguage, ChatRequest } from "@/types";
import { sendChatMessage } from "@/lib/api/client";
import { SUGGESTED_PROMPTS } from "@/lib/constants";

const LOCAL_STORAGE_CHAT_KEY = "vyapaar_sathi_chat_history";

const DEFAULT_WELCOME_MESSAGE: MessageItem = {
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
};

interface ChatWindowProps {
  initialQuery?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ initialQuery }) => {
  const [messages, setMessages] = useState<MessageItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_CHAT_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    }
    return [DEFAULT_WELCOME_MESSAGE];
  });

  const [selectedLanguage, setSelectedLanguage] = useState<ChatLanguage>("hinglish");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeWorkerList, setActiveWorkerList] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(SUGGESTED_PROMPTS);
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number>(501);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save chat history to localStorage on message updates
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_CHAT_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, activeWorkerList]);

  const processedInitialQueryRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialQuery && processedInitialQueryRef.current !== initialQuery) {
      processedInitialQueryRef.current = initialQuery;
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const getWorkersForPrompt = (text: string): string[] => {
    const msgLower = text.toLowerCase();
    const isSales = ['sales', 'growth', 'falling', 'dropping', 'decrease', 'drop', 'revenue', 'monthly', 'gir', 'kam', 'profit'].some(k => msgLower.includes(k));
    const isProduct = ['product', 'item', 'declining', 'dishes', 'menu', 'burger', 'selling', 'losing'].some(k => msgLower.includes(k));
    const isCustomer = ['customer', 'inactive', 'winback', 'retention', 'cohort', 'grahak', 'at-risk', 'loyal'].some(k => msgLower.includes(k));
    const isInventory = ['inventory', 'stock', 'restock', 'reorder', 'cold coffee', 'buns', 'excess', 'mal'].some(k => msgLower.includes(k));
    const isComboPromo = ['combo', 'promotion', 'campaign', 'offer', 'offered combo', 'discount', 'saver'].some(k => msgLower.includes(k));

    if (isComboPromo) return ["Promotion Worker", "Product Worker", "Sales Worker"];
    if (isProduct) return ["Product Worker", "Sales Worker"];
    if (isCustomer) return ["Customer Worker", "Promotion Worker"];
    if (isInventory) return ["Inventory Worker", "Product Worker"];
    if (isSales) return ["Sales Worker", "Forecast Worker"];
    return ["Sales Worker"];
  };

  const handleSendMessage = async (userText: string) => {
    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      language: selectedLanguage,
    };

    const targetWorkers = getWorkersForPrompt(userText);

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setActiveWorkerList(targetWorkers);

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
        workers: response.workers || targetWorkers,
        visuals: response.visuals,
        suggestions: response.suggestions,
        recommendation: (userText.toLowerCase().includes("combo") || userText.toLowerCase().includes("promotion") || userText.toLowerCase().includes("inactive")) ? {
          title: "Burger + Cold Coffee Offered Combo",
          regularPrice: 210,
          suggestedPrice: 149,
          expectedBenefit: "Clear 180 units excess Cold Coffee stock & revive Veg Supreme Burger sales (-34%)",
          reason: "Veg Supreme Burger and Cold Coffee are top cross-selling pairs. Bundling at ₹149 yields ₹6,800 estimated monthly revenue.",
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

  const handleClearChat = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_CHAT_KEY);
    }
    setMessages([DEFAULT_WELCOME_MESSAGE]);
    setSuggestions(SUGGESTED_PROMPTS);
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
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-slate-50 border border-slate-200/80 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 p-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-5 h-5 text-paytm-cyan" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-extrabold text-slate-900">Vyapaar Sathi AI Companion</h2>
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>Online</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Autonomous multi-agent business OS • Merchant #1
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />

          <button
            onClick={handleClearChat}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200/80 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-2xs cursor-pointer"
            title="Clear conversation history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
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
      <div className="p-3 bg-white border-t border-slate-200/80 space-y-3">
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
