import Link from "next/link";
import { dummyTalents } from "@/lib/dummy-talents";
import { TalentCard } from "@/app/components/talent/TalentCard";

export default function LandingPage() {
  const previewTalents = dummyTalents.filter(
    (t) => t.availability !== "employed"
  ).slice(0, 4);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-[1080px] px-5 h-[56px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" rx="6" fill="#3182F6" />
              <path d="M6 10.5L9 13.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[18px] font-medium text-gray-900 tracking-tight">
              TalentMarket
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/talents"
              className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors"
            >
              인재 보기
            </Link>
            <Link
              href="/login"
              className="text-[14px] text-blue-500 font-medium hover:text-blue-600 transition-colors"
            >
              로그인
            </Link>
          </div>
        </div>
        <div className="h-[0.5px] bg-gray-200/80" />
      </header>

      {/* 히어로 */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1080px] px-5 py-16 md:py-24">
          <div className="max-w-[560px]">
            <p className="text-[14px] text-blue-500 font-medium mb-3 animate-section">
              베트남 IT 인재 마켓플레이스
            </p>
            <h1 className="text-[32px] md:text-[40px] font-medium text-gray-900 leading-tight tracking-tight mb-4 animate-section animate-delay-1">
              이력서 대신,<br />
              3초 만에 인재를 파악하세요
            </h1>
            <p className="text-[16px] text-gray-600 leading-relaxed mb-8 animate-section animate-delay-2">
              KTC가 검증한 베트남 IT 인재의 능력치를 한눈에 비교하고,
              <br className="hidden md:block" />
              바로 인터뷰를 요청하세요. 영업일 1일 내 회신드립니다.
            </p>
            <div className="flex gap-3 animate-section animate-delay-3">
              <Link
                href="/talents"
                className="bg-blue-500 text-white px-6 py-3.5 rounded-xl text-[15px] font-medium hover:bg-blue-600 active:scale-[0.98] transition"
              >
                인재 둘러보기
              </Link>
              <Link
                href="/login"
                className="bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl text-[15px] font-medium hover:bg-gray-200 active:scale-[0.98] transition"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
        <div className="h-[0.5px] bg-gray-200/80" />
      </section>

      {/* 핵심 가치 3개 */}
      <section className="mx-auto max-w-[1080px] px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([
            {
              title: "KTC 검증 인재",
              desc: "기술력, 한국어, 협업 능력까지 6대 역량을 직접 평가한 인재만 등록됩니다.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3182F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              ),
            },
            {
              title: "3초 인재 파악",
              desc: "FIFA 스타일 능력치 카드로 이력서를 읽지 않고도 인재를 빠르게 비교할 수 있습니다.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3182F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              ),
            },
            {
              title: "1일 내 회신",
              desc: "인터뷰 요청 즉시 KTC 매니저가 후보자와 일정을 조율하고, 영업일 1일 내 회신드립니다.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3182F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              ),
            },
          ] as const).map((item, i) => (
            <div
              key={item.title}
              className={`bg-white border-[0.5px] border-gray-200/60 rounded-[20px] p-6 animate-section`}
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <p className="text-[15px] font-medium text-gray-900 mb-2">
                {item.title}
              </p>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 인재 미리보기 (블러 처리) */}
      <section className="mx-auto max-w-[1080px] px-5 pb-14">
        <p className="text-[18px] font-medium text-gray-900 tracking-tight mb-4">
          이런 인재들이 등록되어 있어요
        </p>
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px] select-none pointer-events-none">
            {previewTalents.map((talent, i) => (
              <div key={talent.id} className="blur-[3px]">
                <TalentCard
                  talent={talent}
                  photoUrl={[
                    "https://randomuser.me/api/portraits/men/32.jpg",
                    "https://randomuser.me/api/portraits/women/44.jpg",
                    "https://randomuser.me/api/portraits/men/67.jpg",
                    "https://randomuser.me/api/portraits/women/17.jpg",
                  ][i]}
                />
              </div>
            ))}
          </div>
          {/* 오버레이 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/60 rounded-2xl">
            <p className="text-[15px] font-medium text-gray-900 mb-1">
              로그인하면 인재 프로필을 확인할 수 있어요
            </p>
            <p className="text-[13px] text-gray-500 mb-4">
              KTC 검증 인재 142명의 상세 능력치를 확인해보세요
            </p>
            <Link
              href="/login"
              className="bg-blue-500 text-white px-5 py-3 rounded-xl text-[14px] font-medium hover:bg-blue-600 active:scale-[0.98] transition"
            >
              로그인하고 확인하기
            </Link>
          </div>
        </div>
      </section>

      {/* CTA 배너 */}
      <section className="bg-white border-t-[0.5px] border-gray-200/60">
        <div className="mx-auto max-w-[1080px] px-5 py-14 text-center">
          <p className="text-[22px] font-medium text-gray-900 tracking-tight mb-2">
            지금 바로 인재를 확인해보세요
          </p>
          <p className="text-[14px] text-gray-500 mb-6">
            로그인 없이도 인재 프로필을 둘러볼 수 있습니다
          </p>
          <Link
            href="/talents"
            className="inline-block bg-blue-500 text-white px-8 py-3.5 rounded-xl text-[15px] font-medium hover:bg-blue-600 active:scale-[0.98] transition"
          >
            인재 둘러보기
          </Link>
        </div>
      </section>

      {/* 풋터 */}
      <footer className="border-t-[0.5px] border-gray-200/60 bg-gray-50">
        <div className="mx-auto max-w-[1080px] px-5 py-8">
          <div className="flex items-center gap-2 mb-3">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" rx="6" fill="#3182F6" />
              <path d="M6 10.5L9 13.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[14px] font-medium text-gray-700">
              TalentMarket
            </span>
          </div>
          <p className="text-[12px] text-gray-500">
            KTC 파트너사 · 베트남 IT 인재 마켓플레이스
          </p>
        </div>
      </footer>
    </main>
  );
}
