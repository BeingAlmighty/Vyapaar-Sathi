"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Zap, CheckCircle2, ShieldCheck, ArrowRight, Clock } from "lucide-react";
import { getCampaigns, approveCampaign } from "@/lib/api/client";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ApprovalModal } from "@/components/shared/ApprovalModal";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function CampaignsPage() {
  const merchantId = 1;
  const queryClient = useQueryClient();

  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["campaigns", merchantId],
    queryFn: () => getCampaigns(merchantId),
  });

  const approveMutation = useMutation({
    mutationFn: (campaignId: number) => approveCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns", merchantId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", merchantId] });
    },
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load autonomous campaigns"
        message="Backend endpoint /api/campaigns/1 failed to respond."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Autonomous Actions & Campaign Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Review proposed AI decisions, sign off approval, and monitor campaign execution.
          </p>
        </div>

        <Link
          href="/teammate?query=Suggest%20a%20new%20campaign"
          className="inline-flex items-center space-x-2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-xs shrink-0"
        >
          <span>Propose New Campaign</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {data.map((camp) => {
          const isPending = camp.status === "pending_approval";

          return (
            <div
              key={camp.id}
              className={`bg-white border rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all space-y-4 ${
                isPending ? "border-sky-300 ring-2 ring-sky-100" : "border-slate-200/70"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
                    <Zap className="w-5 h-5 text-paytm-cyan" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{camp.title}</h3>
                    <span className="text-xs text-slate-500 font-medium">
                      Target: <span className="text-slate-800 font-semibold">{camp.target_audience}</span>
                    </span>
                  </div>
                </div>

                <StatusBadge status={camp.status} type="campaign" />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{camp.description}</p>

              {/* Action area */}
              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Created {formatDate(camp.created_at || "")}</span>
                </div>

                {isPending ? (
                  <button
                    onClick={() => setSelectedCampaign(camp.id)}
                    className="inline-flex items-center space-x-2 bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-slate-800 transition-all shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-paytm-cyan" />
                    <span>Review & Approve Campaign</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Active & Monitored by AI</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={selectedCampaign !== null}
        onClose={() => setSelectedCampaign(null)}
        campaignId={selectedCampaign || 501}
        onSuccess={() => {
          approveMutation.mutate(selectedCampaign || 501);
          setSelectedCampaign(null);
        }}
      />
    </div>
  );
}
