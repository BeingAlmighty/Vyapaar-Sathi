"use client";

import React from "react";
import { Sparkles, ArrowRight, CheckCircle2, ShoppingBag, ShieldCheck } from "lucide-react";
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
    <div className="bg-white border-2 border-paytm-cyan/50 rounded-xl p-5 shadow-paytm-card my-4 relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-paytm-lightBlue rounded-lg text-paytm-navy">
            <Sparkles className="w-4 h-4 text-paytm-cyan" />
          </span>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-paytm-navy bg-paytm-lightBlue px-2 py-0.5 rounded">
              AI Decision Proposal
            </span>
            <h4 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">{title}</h4>
          </div>
        </div>

        {isApproved ? (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved</span>
          </span>
        ) : (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Requires Merchant Approval</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/80 mb-3 text-xs">
        <div>
          <span className="text-slate-500 font-medium block">Regular Price</span>
          <span className="text-slate-700 font-bold line-through">{formatCurrency(regularPrice)}</span>
        </div>
        <div>
          <span className="text-slate-500 font-medium block">Suggested Combo Price</span>
          <span className="text-emerald-700 font-extrabold text-sm">{formatCurrency(suggestedPrice)}</span>
        </div>
      </div>

      <div className="space-y-2 text-xs mb-4">
        <div>
          <span className="font-bold text-slate-900 block">Expected Benefit:</span>
          <p className="text-slate-600 leading-relaxed">{expectedBenefit}</p>
        </div>
        <div>
          <span className="font-bold text-slate-900 block">AI Rationale:</span>
          <p className="text-slate-600 leading-relaxed">{reason}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-1">
        {!isApproved ? (
          <>
            <button
              onClick={onApprove}
              className="flex-1 bg-paytm-navy text-white font-bold text-xs py-2.5 px-4 rounded-lg hover:bg-paytm-darkBlue transition-all shadow-sm flex items-center justify-center space-x-1.5"
            >
              <span>Approve & Create Combo</span>
              <ArrowRight className="w-4 h-4 text-paytm-cyan" />
            </button>
            <button
              onClick={onReview}
              className="bg-slate-100 text-slate-700 font-semibold text-xs py-2.5 px-3 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Review Details
            </button>
          </>
        ) : (
          <div className="w-full bg-emerald-50 text-emerald-800 text-xs font-medium p-2.5 rounded-lg border border-emerald-200 text-center">
            ✓ Campaign scheduled successfully. Your teammate is monitoring performance.
          </div>
        )}
      </div>
    </div>
  );
};
