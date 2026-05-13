import { Talent } from "@/lib/types";

function getGradeStyle(grade: string) {
  switch (grade) {
    case "S":
      return "bg-grade-s-bg text-grade-s-text";
    case "A":
      return "bg-grade-a-bg text-grade-a-text";
    default:
      return "bg-grade-b-bg text-grade-b-text";
  }
}

function getAvailabilityInfo(availability: string) {
  switch (availability) {
    case "immediate":
      return { label: "즉시 합류", dotColor: "bg-status-available" };
    case "negotiable":
      return { label: "협의 가능", dotColor: "bg-status-negotiable" };
    default:
      return { label: "현직", dotColor: "bg-status-employed" };
  }
}

function KoreanStars({ level }: { level: number }) {
  return (
    <div className="flex gap-[1px] items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10">
          <path
            d="M5 0.5L6.1 3.7H9.5L6.7 5.7L7.8 8.9L5 6.9L2.2 8.9L3.3 5.7L0.5 3.7H3.9L5 0.5Z"
            fill={i < level ? "#3182F6" : "#E5E8EB"}
          />
        </svg>
      ))}
    </div>
  );
}

export function TalentCard({ talent }: { talent: Talent }) {
  const status = getAvailabilityInfo(talent.availability);
  const isEmployed = talent.availability === "employed";

  return (
    <div
      className={`bg-white rounded-2xl border-0.5 border-gray-200/60 p-4 cursor-pointer transition-all duration-100 ease-in-out hover:border-gray-300 active:scale-[0.98] ${
        isEmployed ? "opacity-[0.72]" : ""
      }`}
    >
      {/* 상단: 아바타 + OVR 뱃지 (TDS Badge 스타일) */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-[42px] h-[42px] rounded-full bg-blue-50 flex items-center justify-center">
          <span className="text-sm font-medium text-blue-500">
            {talent.initials}
          </span>
        </div>
        {/* TDS Badge: fill variant 스타일 - 8px radius, 3px 6px padding */}
        <span
          className={`text-2xs font-medium px-[6px] py-[3px] rounded-lg ${getGradeStyle(talent.ovr_grade)}`}
        >
          {talent.ovr_grade} {talent.ovr_score}
        </span>
      </div>

      {/* 직무 + 연차/지역 */}
      <p className="text-md font-medium text-gray-900 leading-tight">
        {talent.role}
      </p>
      <p className="text-xs text-gray-500 mt-[2px]">
        {talent.years_exp}년차 · {talent.location}
      </p>

      {/* 핵심 스킬 태그 (TDS Badge weak 스타일) */}
      <div className="flex gap-1 mt-[10px] flex-wrap">
        {talent.top_skills.map((skill) => (
          <span
            key={skill}
            className="text-2xs text-gray-600 bg-gray-100 px-[6px] py-[3px] rounded-lg leading-none"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* 한국어 능력 */}
      <div className="flex items-center gap-[6px] mt-[10px]">
        <span className="text-2xs text-gray-500">한국어</span>
        <KoreanStars level={talent.korean_level} />
      </div>

      {/* 하단: 합류 상태 & 연봉 */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-[5px]">
          <span
            className={`w-[5px] h-[5px] rounded-full ${status.dotColor}`}
          />
          <span className="text-2xs text-gray-500">{status.label}</span>
        </div>
        <span className="text-sm font-medium text-gray-900">
          ${talent.desired_salary_usd.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
