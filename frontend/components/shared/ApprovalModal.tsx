"use client";

import React, { useState } from "react";
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Zap, ArrowRight, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { approveCampaign } from "@/lib/api/client";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId?: number;
  title?: string;
  regularPrice?: number;
  suggestedPrice?: number;
  targetAudience?: string;
  onSuccess?: () => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  campaignId = 501,
  title = "Burger + Cold Coffee Combo Campaign",
  regularPrice = 200,
  suggestedPrice = 149,
  targetAudience = "24 inactive customers & walk-in Paytm App users",
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConfirmApprove = async () => {
    setIsSubmitting(true);
    try {
      await approveCampaign(campaignId);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="bg-white rounded-2xl shadow-paytm-lg max-w-lg w-full z-50 overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-paytm-navy text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-paytm-cyan/20 border border-paytm-cyan/40 flex items-center justify-center text-paytm-cyan">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-paytm-cyan">
                Merchant Sign-Off Required
              </span>
              <h3 className="text-sm font-bold text-white">Review Campaign Proposal</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Campaign Approved & Triggered!</h3>
              <p className="text-slate-600">
                Your Business Teammate is executing this campaign and will continuously monitor conversion results.
              </p>
            </div>
          ) : (
            <>
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{title}</h4>
                <p className="text-slate-600">
                  Target Audience: <span className="font-semibold text-slate-900">{targetAudience}</span>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-medium block">Standard Menu Price</span>
                  <span className="text-slate-700 font-bold text-sm line-through">
                    {formatCurrency(regularPrice)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Approved Promotional Combo</span>
                  <span className="text-emerald-700 font-extrabold text-base">
                    {formatCurrency(suggestedPrice)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50/80 border border-blue-200 text-blue-950 p-3.5 rounded-xl space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-paytm-navy" /> Human-in-the-Loop Safeguard
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Autonomous actions are never pushed to live customer POS terminals without explicit merchant approval. Approving will update Paytm QR discount banners and schedule SMS alerts.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center space-x-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmApprove}
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 px-4 bg-paytm-navy text-white font-bold rounded-xl hover:bg-paytm-darkBlue transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Approving...</span>
                    </>
                  ) : (
                    <>
                      <span>Approve & Launch Campaign</span>
                      <ArrowRight className="w-4 h-4 text-paytm-cyan" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
