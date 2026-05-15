"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Talent, toInitials } from "@/lib/types";
import { TalentDetailModal } from "@/app/components/talent/TalentDetailModal";
import { availabilityKR } from "@/lib/i18n";

type InterviewRequest = {
  id: string;
  talent_id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  message: string | null;
  status: "pending" | "contacted" | "completed" | "cancelled";
  created_at: string;
};

type RequestWithTalent = InterviewRequest & { talent: Talent | null };

const STATUS_MAP: Record<string, { label: string; style: string }> = {
  pending: { label: "대기", style: "bg-[#FFF8F0] text-[#E8590C]" },
  contacted: { label: "연락 완료", style: "bg-blue-50 text-blue-500" },
  completed: { label: "완료", style: "bg-[#E8F5E9] text-[#1D9E75]" },
  cancelled: { label: "취소", style: "bg-gray-100 text-gray-500" },
};

export default function InquiriesPage() {
  const [requests, setRequests] = useState<RequestWithTalent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "pending" | "contacted" | "completed" | "cancelled">("all");
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    // 문의 목록 가져오기
    const { data: reqs, error } = await supabase
      .from("interview_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !reqs) {
      setLoading(false);
      return;
    }

    // 관련 인재 정보 가져오기
    const talentIds = Array.from(new Set(reqs.map((r: InterviewRequest) => r.talent_id)));
    const { data: talents } = await supabase
      .from("talents")
      .select("*")
      .in("id", talentIds);

    const talentMap = new Map<string, Talent>();
    if (talents) {
      talents.forEach((t: Talent) => talentMap.set(t.id, t));
    }

    const merged: RequestWithTalent[] = reqs.map((r: InterviewRequest) => ({
      ...r,
      talent: talentMap.get(r.talent_id) || null,
    }));

    setRequests(merged);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase
      .from("interview_requests")
      .update({ status })
      .eq("id", id);
    await loadRequests();
  }

  const filtered = tab === "all" ? requests : requests.filter((r) => r.status === tab);
  const tabCounts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    contacted: requests.filter((r) => r.status === "contacted").length,
    completed: requests.filter((r) => r.status === "completed").length,
    cancelled: requests.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div>
      <h1 className="text-[22px] font-medium text-gray-900 tracking-tight mb-1">
        인재 문의
      </h1>
      <p className="text-[14px] text-gray-500 mb-6">
        인터뷰 요청 현황 관리
      </p>

      {/* 탭 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "contacted", "completed", "cancelled"] as const).map((t) => {
          const labels = { all: "전체", pending: "대기", contacted: "연락 완료", completed: "완료", cancelled: "취소" };
          const count = tabCounts[t];
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-[14px] py-[7px] rounded-full text-[13px] transition-colors ${
                tab === t
                  ? "bg-gray-900 text-white"
                  : "bg-white border-[0.5px] border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {labels[t]} {count > 0 && <span className="ml-1">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-[14px] text-gray-500">로딩 중...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[14px] text-gray-500">문의 내역이 없습니다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((req) => {
            const statusInfo = STATUS_MAP[req.status] || STATUS_MAP.pending;
            return (
              <div
                key={req.id}
                className="bg-white border-[0.5px] border-gray-200/60 rounded-2xl p-5"
              >
                {/* 요청자 정보 */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[15px] font-medium text-gray-900">
                      {req.contact_name}
                      <span className="text-[13px] font-normal text-gray-500"> · {req.company_name}</span>
                    </p>
                    <p className="text-[13px] text-gray-500">{req.contact_email}</p>
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${statusInfo.style}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* 요청 대상 인재 */}
                {req.talent && (
                  <div
                    className="bg-gray-50 rounded-xl px-4 py-3 mb-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSelectedTalent(req.talent)}
                  >
                    <p className="text-[11px] text-gray-500 mb-2">요청 대상</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-[12px] font-medium text-blue-500">
                          {toInitials(req.talent.name)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-gray-900">
                          {req.talent.role} · {req.talent.years_exp}년차
                        </p>
                        <p className="text-[12px] text-gray-500">
                          OVR {req.talent.ovr_score} · {req.talent.location} · {availabilityKR[req.talent.availability]}
                        </p>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#B0B8C1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <path d="M6 4l4 4-4 4" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* 메시지 */}
                {req.message && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3 mb-3">
                    <p className="text-[11px] text-gray-500 mb-1">메시지</p>
                    <p className="text-[13px] text-gray-700 leading-relaxed">{req.message}</p>
                  </div>
                )}

                {/* 하단: 날짜 + 상태 변경 */}
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500">
                    {new Date(req.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>

                  <div className="flex items-center gap-2">
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(req.id, "cancelled")}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[12px] font-medium hover:bg-gray-200 transition-colors"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => updateStatus(req.id, "contacted")}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-[12px] font-medium hover:bg-blue-600 transition-colors"
                        >
                          연락 완료
                        </button>
                      </>
                    )}
                    {req.status === "contacted" && (
                      <button
                        onClick={() => updateStatus(req.id, "completed")}
                        className="px-3 py-1.5 bg-[#1D9E75] text-white rounded-lg text-[12px] font-medium hover:bg-[#178a65] transition-colors"
                      >
                        완료 처리
                      </button>
                    )}
                    {(req.status === "completed" || req.status === "cancelled") && (
                      <button
                        onClick={() => updateStatus(req.id, "pending")}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[12px] font-medium hover:bg-gray-200 transition-colors"
                      >
                        대기로 변경
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 인재 상세 모달 */}
      {selectedTalent && (
        <TalentDetailModal
          talent={selectedTalent}
          onClose={() => setSelectedTalent(null)}
        />
      )}
    </div>
  );
}
