"use client";

export function InterviewCTA({
  talentId,
  salaryUsd,
}: {
  talentId: string;
  salaryUsd: number;
}) {
  return (
    <div className="bg-white border-[0.5px] border-gray-200/60 rounded-[20px] px-5 py-4 flex items-center gap-3">
      <div className="flex-1">
        <p className="text-[12px] text-gray-500 mb-1">희망 연봉 (월)</p>
        <p className="text-[18px] font-medium text-gray-900">
          ${salaryUsd.toLocaleString("en-US")}
        </p>
      </div>
      <button
        onClick={() => console.log("Interview requested:", talentId)}
        className="bg-blue-500 text-white px-6 py-3.5 rounded-xl text-[15px] font-medium hover:bg-blue-600 active:scale-[0.98] transition-transform flex-shrink-0"
      >
        인터뷰 요청하기
      </button>
    </div>
  );
}
