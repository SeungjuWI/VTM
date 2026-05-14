import { Header } from "@/app/components/Header";

export default function QnaPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <Header />
      <div className="mx-auto max-w-[720px] px-5 pt-8 pb-16">
        <h1 className="text-[22px] font-medium text-gray-900 tracking-tight mb-2">
          Q&A
        </h1>
        <p className="text-[14px] text-gray-500 mb-8">
          자주 묻는 질문과 답변
        </p>
        <div className="text-center py-20">
          <p className="text-[14px] text-gray-400">아직 등록된 질문이 없습니다</p>
        </div>
      </div>
    </main>
  );
}
