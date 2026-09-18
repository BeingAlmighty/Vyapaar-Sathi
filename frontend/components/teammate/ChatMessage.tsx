"use client";

import React from "react";
import { Bot, User, Sparkles } from "lucide-react";
import { ChatVisual, ChatLanguage } from "@/types";
import { WorkerProgress } from "@/components/teammate/WorkerProgress";
import { VisualRenderer } from "@/components/teammate/VisualRenderer";
import { RecommendationCard } from "@/components/shared/RecommendationCard";

export interface MessageItem {
  id: string;
  sender: "user" | "ai";
  text: string;
  language?: ChatLanguage;
  workers?: string[];
  visuals?: ChatVisual[];
  recommendation?: {
    title: string;
    regularPrice: number;
    suggestedPrice: number;
    expectedBenefit: string;
    reason: string;
    campaignId?: number;
  };
  isApproved?: boolean;
}

interface ChatMessageProps {
  message: MessageItem;
  onApproveCampaign?: (campaignId?: number) => void;
  onReviewCampaign?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onApproveCampaign,
  onReviewCampaign,
}) => {
  const isUser = message.sender === "user";

  return (
    <div className={`flex space-x-3 my-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-paytm-navy border border-paytm-cyan/30 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Bot className="w-4 h-4 text-paytm-cyan" />
        </div>
      )}

      <div className={`max-w-2xl space-y-2 ${isUser ? "items-end" : "items-start"}`}>
        {/* Header label */}
        <div className={`flex items-center space-x-2 text-[11px] font-semibold text-slate-500 ${isUser ? "justify-end" : ""}`}>
          <span>{isUser ? "You (Rajesh)" : "Business Teammate"}</span>
          {message.language && (
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded text-[10px] uppercase">
              {message.language}
            </span>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
            isUser
              ? "bg-paytm-navy text-white rounded-tr-none font-medium"
              : "bg-white text-slate-900 border border-slate-200 rounded-tl-none shadow-paytm-sm"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>

        {/* Worker visualization if included */}
        {!isUser && message.workers && message.workers.length > 0 && (
          <div className="mt-3">
            <WorkerProgress workers={message.workers} isAnalyzing={false} />
          </div>
        )}

        {/* Dynamic visual charts/cards */}
        {!isUser && message.visuals && message.visuals.length > 0 && (
          <VisualRenderer visuals={message.visuals} />
        )}

        {/* Recommendation Approval Card */}
        {!isUser && message.recommendation && (
          <RecommendationCard
            title={message.recommendation.title}
            regularPrice={message.recommendation.regularPrice}
            suggestedPrice={message.recommendation.suggestedPrice}
            expectedBenefit={message.recommendation.expectedBenefit}
            reason={message.recommendation.reason}
            isApproved={message.isApproved}
            onApprove={() => onApproveCampaign && onApproveCampaign(message.recommendation?.campaignId)}
            onReview={onReviewCampaign}
          />
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
          <User className="w-4 h-4 text-slate-600" />
        </div>
      )}
    </div>
  );
};
