"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DetailNav() {
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => router.back()}
        className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors"
      >
        ← 목록
      </button>
      <div className="flex gap-2">
        {/* 찜 버튼 */}
        <button
          onClick={() => setLiked(!liked)}
          className="w-10 h-10 flex items-center justify-center bg-white border-[0.5px] border-gray-200/60 rounded-xl hover:border-gray-300 active:scale-[0.95] transition-all"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill={liked ? "#3182F6" : "none"}
            stroke={liked ? "#3182F6" : "#6B7684"}
            strokeWidth="1.5"
          >
            <path d="M9 15.37l-1.36-1.24C3.6 10.48 1 8.2 1 5.5 1 3.22 2.82 1.4 5.1 1.4c1.28 0 2.51.6 3.4 1.54A4.77 4.77 0 0 1 11.9 1.4C14.18 1.4 16 3.22 16 5.5c0 2.7-2.6 4.98-6.64 8.63L9 15.37z" />
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
