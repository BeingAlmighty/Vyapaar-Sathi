"use client";

import React from "react";
import { Bot, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface RecommendationCardProps {
  title?: string;
  regularPrice?: number;
  suggestedPrice?: number;
  expectedBenefit?: string;
  reason?: string;
  onApprove?: () => void;
  onReview?: () => void;
  isApproved?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title = "Burger + Cold Coffee Combo Offer",
  regularPrice = 200,
  suggestedPrice = 149,
  expectedBenefit = "Increase sales volume & clear 180 excess Cold Coffee inventory",
  reason = "Veg Supreme Burger sales dropped 34% while Cold Coffee is overstocked. Bundling at ₹149 yields high net profit margin.",
  onApprove,
  onReview,
  isApproved = false,
}) => {
  return (
    <div className="bg-white border border-sky-200/80 rounded-3xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] my-4 relative overflow-hidden font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center space-x-2.5">
          <span className="p-2 bg-sky-50 rounded-xl text-sky-800 border border-sky-200/60">
            <Bot className="w-4 h-4 text-sky-700" />
          </span>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200/60">
              AI Decision Proposal
            </span>
            <h4 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">{title}</h4>
          </div>
        </div>

        {isApproved ? (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved</span>
          </span>
        ) : (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Requires Merchant Approval</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 mb-3 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Regular Price</span>
          <span className="text-slate-700 font-bold line-through">{formatCurrency(regularPrice)}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Suggested Price</span>
          <span className="text-emerald-700 font-extrabold text-sm">{formatCurrency(suggestedPrice)}</span>
        </div>
      </div>

      <div className="space-y-1.5 text-xs mb-4">
        <p className="text-slate-700 font-medium leading-relaxed">
          <strong className="text-slate-900 font-bold">Benefit:</strong> {expectedBenefit}
        </p>
        <p className="text-slate-500 text-[11px] leading-relaxed">{reason}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-slate-100">
        {onReview && (
          <button
            onClick={onReview}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all text-center"
          >
            Review Campaign Details
          </button>
        )}

        <button
          onClick={onApprove}
          disabled={isApproved}
          className={`w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 ${
            isApproved
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          <span>{isApproved ? "Approved & Scheduled" : "Approve & Execute Campaign"}</span>
          {!isApproved && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
