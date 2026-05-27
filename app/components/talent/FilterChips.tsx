"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { translateRole } from "@/lib/i18n";

export type RoleFilter = string;
export type SortOption = string;

// 카테고리별 소속 판별 (번역된 한국어 role 기준)
const CATEGORY_MATCHERS: { label: string; match: (role: string) => boolean }[] = [
  {
    label: "개발자",
    match: (r) => r.includes("개발자") || (r.includes("엔지니어") && !r.includes("QA") && !r.includes("AI") && !r.includes("ML") && !r.includes("데이터")),
  },
  {
    label: "디자이너",
    match: (r) => r.includes("디자이너"),
  },
  {
    label: "데이터/AI",
    match: (r) => r.includes("데이터") || r.includes("AI") || r.includes("ML"),
  },
  {
    label: "QA",
    match: (r) => r.includes("QA"),
  },
  {
    label: "마케팅",
    match: (r) => r.includes("마케") || r.includes("이커머스") || r.includes("광고"),
  },
  {
    label: "기타",
    match: (r) => r.includes("HR") || r.includes("회계") || r.includes("재무") || r.includes("행정") || r.includes("오피스") || r.includes("통역"),
  },
];

const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: "추천순", value: "recommended" },
  { label: "연봉 낮은순", value: "salary_asc" },
  { label: "연봉 높은순", value: "salary_desc" },
  { label: "경력 높은순", value: "exp_desc" },
  { label: "경력 낮은순", value: "exp_asc" },
  { label: "한국어 잘하는순", value: "korean_desc" },
  { label: "최근 등록순", value: "newest" },
];

interface FilterChipsProps {
  roles?: string[];
  onRoleChange?: (roles: string[]) => void;
  onSortChange?: (sort: string) => void;
}

export function FilterChips({ roles: rawRoles, onRoleChange, onSortChange }: FilterChipsProps) {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [activeSubRole, setActiveSubRole] = useState<string | null>(null);
  const [sort, setSort] = useState("recommended");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 실제 데이터에서 번역된 role 목록 → 카테고리별 그룹
  const categoryRoles = useMemo(() => {
    const translatedRoles = (rawRoles || []).map(translateRole);
    const unique = Array.from(new Set(translatedRoles)).sort();

    const map: Record<string, string[]> = {};
    for (const cat of CATEGORY_MATCHERS) {
      const matched = unique.filter(cat.match);
      if (matched.length > 0) {
        map[cat.label] = matched;
      }
    }
    return map;
  }, [rawRoles]);

  const categories = ["전체", ...Object.keys(categoryRoles)];
  const currentSubRoles = categoryRoles[activeCategory] || [];

  function handleCategoryClick(label: string) {
    setActiveCategory(label);
    setActiveSubRole(null);
    if (label === "전체") {
      onRoleChange?.([]);
    } else {
      onRoleChange?.(categoryRoles[label] || []);
    }
  }

  function handleSubRoleClick(role: string) {
    if (activeSubRole === role) {
      setActiveSubRole(null);
      onRoleChange?.(categoryRoles[activeCategory] || []);
    } else {
      setActiveSubRole(role);
      onRoleChange?.([role]);
    }
  }

  function handleSortClick(value: string) {
    setSort(value);
    setShowSortDropdown(false);
    onSortChange?.(value);
  }

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label || "추천순";

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((label) => {
            const isActive = activeCategory === label;
            return (
              <button
                key={label}
                onClick={() => handleCategoryClick(label)}
                className={`whitespace-nowrap text-[13px] px-[14px] py-[7px] rounded-full transition-colors duration-100 ${
                  isActive
                    ? "bg-[#191F28] text-white"
                    : "bg-white border border-[#E5E8EB] text-[#4E5968] hover:border-[#D1D6DB]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="relative ml-3" ref={sortRef}>
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="whitespace-nowrap text-[12px] text-[#6B7684] hover:text-[#191F28] transition-colors flex items-center gap-1"
          >
            {sortLabel}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#E5E8EB] rounded-xl py-1.5 z-20 min-w-[140px]">
              {SORT_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => handleSortClick(value)}
                  className={`block w-full text-left px-4 py-2 text-[13px] transition-colors ${
                    sort === value
                      ? "text-[#3182F6] bg-[#E8F3FF]/50"
                      : "text-[#4E5968] hover:bg-[#F9FAFB]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {currentSubRoles.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {currentSubRoles.map((role) => {
            const isActive = activeSubRole === role;
            return (
              <button
                key={role}
                onClick={() => handleSubRoleClick(role)}
                className={`whitespace-nowrap text-[12px] px-3 py-[5px] rounded-full transition-colors duration-100 ${
                  isActive
                    ? "bg-[#3182F6] text-white"
                    : "bg-[#F2F4F6] text-[#6B7684] hover:bg-[#E5E8EB]"
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
