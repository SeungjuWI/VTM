"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { JD_MAP, type JobDescription } from "@/lib/jd-data";
import { useAdminI18n } from "@/lib/admin-i18n";

interface JDWithStats {
  code: string;
  jd: JobDescription;
  totalCandidates: number;
  statusCounts: Record<string, number>;
}

export default function JDPage() {
  const { t } = useAdminI18n();
  const [jdList, setJdList] = useState<JDWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: candidates } = await supabase
        .from("candidates")
        .select("applied_job, pipeline_status");

      const countsByCode: Record<string, Record<string, number>> = {};

      (candidates || []).forEach((c) => {
        const match = c.applied_job?.match(/^([A-Z]+\d+)/);
        if (!match) return;
        const code = match[1];
        if (!countsByCode[code]) countsByCode[code] = {};
        countsByCode[code][c.pipeline_status] = (countsByCode[code][c.pipeline_status] || 0) + 1;
      });

      const list: JDWithStats[] = Object.entries(JD_MAP).map(([code, jd]) => {
        const statusCounts = countsByCode[code] || {};
        const totalCandidates = Object.values(statusCounts).reduce((a, b) => a + b, 0);
        return { code, jd, totalCandidates, statusCounts };
      });

      setJdList(list);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[14px] text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  const totalJDs = jdList.length;
  const activeJDs = jdList.filter((j) => j.totalCandidates > 0).length;
  const totalHires = jdList.reduce((sum, j) => sum + j.jd.hires, 0);
  const totalCandidatesAll = jdList.reduce((sum, j) => sum + j.totalCandidates, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[22px] font-medium text-gray-900">{t("nav.jd")}</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="전체 JD" value={totalJDs} color="#191F28" />
        <StatCard label="후보자 있는 JD" value={activeJDs} color="#3182F6" />
        <StatCard label="총 채용 인원" value={totalHires} color="#1D9E75" />
        <StatCard label="총 지원자" value={totalCandidatesAll} color="#E8590C" />
      </div>

      <div className="space-y-3">
        {jdList.map((item) => (
          <div key={item.code} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
            <div
              onClick={() => setExpandedCode(expandedCode === item.code ? null : item.code)}
              className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <span className={`inline-block px-2.5 py-1 rounded-lg text-[13px] font-medium ${
                  item.totalCandidates > 0
                    ? "bg-[#E8F3FF] text-[#3182F6]"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {item.code}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[14px] font-medium text-gray-900 truncate">{item.jd.position}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <span>{item.jd.company}</span>
                  <span>·</span>
                  <span>{item.jd.experience}</span>
                  <span>·</span>
                  <span>{item.jd.salary}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-gray-500">채용</span>
                    <span className="text-[14px] font-medium text-gray-900">{item.jd.hires}명</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-gray-500">지원</span>
                    <span className={`text-[14px] font-medium ${item.totalCandidates > 0 ? "text-[#3182F6]" : "text-gray-400"}`}>
                      {item.totalCandidates}명
                    </span>
                  </div>
                </div>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#B0B8C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-100 ${expandedCode === item.code ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {expandedCode === item.code && (
              <div className="px-5 pb-5 border-t border-gray-100">
                {item.totalCandidates > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-4 mb-4">
                    {Object.entries(item.statusCounts).map(([status, count]) => (
                      <span key={status} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]"
                        style={{ backgroundColor: statusColor(status) + "18", color: statusColor(status) }}>
                        {statusLabel(status)} {count}
                      </span>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  <DetailSection title="Responsibilities" content={item.jd.responsibilities} />
                  <DetailSection title="Qualifications" content={item.jd.qualifications} />
                  {item.jd.preferred && <DetailSection title="Preferred" content={item.jd.preferred} />}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-4">
      <p className="text-[11px] text-gray-500 mb-1">{label}</p>
      <p className="text-[22px] font-medium" style={{ color }}>{value}</p>
    </div>
  );
}

function DetailSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <p className="text-[11px] text-gray-500 mb-1.5">{title}</p>
      <div className="text-[12px] text-gray-700 leading-[1.6] whitespace-pre-line bg-gray-50 rounded-xl px-4 py-3">
        {content}
      </div>
    </div>
  );
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    new: "#8B95A1",
    passed: "#3182F6",
    ai_interview_sent: "#E8590C",
    ai_interview_done: "#6B7684",
    final_passed: "#1D9E75",
    rejected: "#B0B8C1",
    screening_failed: "#B0B8C1",
  };
  return map[status] || "#8B95A1";
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    new: "대기",
    passed: "AI 합격",
    ai_interview_sent: "인터뷰 발송",
    ai_interview_done: "인터뷰 완료",
    final_passed: "최종 합격",
    rejected: "불합격",
    screening_failed: "스크리닝 실패",
  };
  return map[status] || status;
}
