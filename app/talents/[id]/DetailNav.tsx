"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { isScraped, toggleScrap } from "@/lib/scraps";

export function DetailNav() {
  const router = useRouter();
  const params = useParams();
  const talentId = params.id as string;
  const [scrapped, setScrapped] = useState(false);

  useEffect(() => {
    setScrapped(isScraped(talentId));
  }, [talentId]);

  function handleScrap() {
    const now = toggleScrap(talentId);
    setScrapped(now);
    window.dispatchEvent(new CustomEvent("scrap-change"));
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => router.back()}
        className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors"
      >
        ← 목록
      </button>
      <div className="flex gap-2">
        {/* 스크랩 버튼 */}
        <button
          onClick={handleScrap}
          className={`w-10 h-10 flex items-center justify-center border-[0.5px] rounded-xl active:scale-[0.95] transition-all ${
            scrapped ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200/60 hover:border-gray-300"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill={scrapped ? "#3182F6" : "none"}
            stroke={scrapped ? "#3182F6" : "#6B7684"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 3h10a1 1 0 011 1v13.5l-6-3.5-6 3.5V4a1 1 0 011-1z"/>
          </svg>
        </button>
        {/* 공유 버튼 */}
        <button className="w-10 h-10 flex items-center justify-center bg-white border-[0.5px] border-gray-200/60 rounded-xl hover:border-gray-300 active:scale-[0.95] transition-all">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="#6B7684"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13.5 6a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5zM4.5 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5zM13.5 16.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5zM6.44 10.24l5.13 3.01M11.56 4.74L6.44 7.76" />
          </svg>
        </button>
      </div>
    </div>
  );
}
