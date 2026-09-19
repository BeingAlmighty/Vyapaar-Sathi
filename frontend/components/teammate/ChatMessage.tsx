"use client";

import React from "react";
import { Bot, User } from "lucide-react";
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
  suggestions?: string[];
  isApproved?: boolean;
}

interface ChatMessageProps {
  message: MessageItem;
  onApproveCampaign?: (campaignId?: number) => void;
  onReviewCampaign?: () => void;
}

function renderInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={i} className="font-extrabold text-slate-900">
          {boldText}
        </strong>
      );
    }
    return part;
  });
}

const FormattedMarkdown: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  if (!content) return null;

  if (isUser) {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = (key: string) => {
    if (!currentList) return;
    if (currentList.type === "ul") {
      elements.push(
        <ul key={key} className="list-disc list-inside space-y-1.5 my-2.5 text-slate-700">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={key} className="list-decimal list-inside space-y-2 my-2.5 text-slate-700">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(`list-${index}`);
      return;
    }

    const ulMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (ulMatch) {
      if (!currentList || currentList.type !== "ul") {
        flushList(`list-${index}`);
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(ulMatch[1]);
      return;
    }

    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (!currentList || currentList.type !== "ol") {
        flushList(`list-${index}`);
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(olMatch[2]);
      return;
    }

    flushList(`list-${index}`);
    elements.push(
      <p key={`p-${index}`} className="my-1.5 leading-relaxed">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList("list-end");

  return <div className="space-y-1 text-xs text-slate-900 font-sans">{elements}</div>;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onApproveCampaign,
  onReviewCampaign,
}) => {
  const isUser = message.sender === "user";

  return (
    <div className={`flex space-x-3 my-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <Bot className="w-4 h-4 text-paytm-cyan" />
        </div>
      )}

      <div className={`max-w-2xl space-y-2.5 ${isUser ? "items-end" : "items-start"}`}>
        {/* Header label */}
        <div className={`flex items-center space-x-2 text-[11px] font-bold text-slate-500 ${isUser ? "justify-end" : ""}`}>
          <span>{isUser ? "You (Rajesh)" : "Business Teammate"}</span>
          {message.language && (
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border border-slate-200/60">
              {message.language}
            </span>
          )}
        </div>

        {/* Worker visualization if included (FIRST for AI) */}
        {!isUser && message.workers && message.workers.length > 0 && (
          <div className="mb-2">
            <WorkerProgress workers={message.workers} isAnalyzing={false} />
          </div>
        )}

        {/* Dynamic visual charts/cards (FIRST/ABOVE TEXT OUTPUT FOR AI) */}
        {!isUser && message.visuals && message.visuals.length > 0 && (
          <VisualRenderer visuals={message.visuals} />
        )}

        {/* Formatted Text Message Output (BELOW VISUALS FOR AI) */}
        <div
          className={`p-4 rounded-2xl text-xs leading-relaxed shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${
            isUser
              ? "bg-slate-900 text-white rounded-tr-none font-medium"
              : "bg-white text-slate-900 border border-slate-200/80 rounded-tl-none"
          }`}
        >
          <FormattedMarkdown content={message.text} isUser={isUser} />
        </div>

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
