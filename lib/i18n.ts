export const availabilityKR = {
  immediate: "즉시 합류 가능",
  negotiable: "협의 가능",
  employed: "현직",
} as const;

// 한국어 role에 접미사 붙이기 (이미 한국어인 경우)
const roleSuffixKR: Record<string, string> = {
  프론트엔드: "개발자",
  백엔드: "개발자",
  풀스택: "개발자",
  "UI/UX 디자이너": "",
  "데이터 분석가": "",
  QA: "엔지니어",
  DevOps: "엔지니어",
};

// 키워드 기반 매칭 (우선순위 순서 — 먼저 매칭되면 바로 반환)
const keywordRules: { keywords: string[]; result: string }[] = [
  // 개발 — 구체적인 것 먼저
  { keywords: ["embedded"], result: "임베디드 엔지니어" },
  { keywords: ["unity"], result: "게임 개발자" },
  { keywords: ["android"], result: "Android 개발자" },
  { keywords: ["ios"], result: "iOS 개발자" },
  { keywords: ["flutter"], result: "모바일 개발자" },
  { keywords: ["react native"], result: "모바일 개발자" },
  { keywords: ["mobile"], result: "모바일 개발자" },
  { keywords: ["full-stack"], result: "풀스택 개발자" },
  { keywords: ["full stack"], result: "풀스택 개발자" },
  { keywords: ["fullstack"], result: "풀스택 개발자" },
  { keywords: ["front-end"], result: "프론트엔드 개발자" },
  { keywords: ["front end"], result: "프론트엔드 개발자" },
  { keywords: ["frontend"], result: "프론트엔드 개발자" },
  { keywords: ["back-end"], result: "백엔드 개발자" },
  { keywords: ["back end"], result: "백엔드 개발자" },
  { keywords: ["backend"], result: "백엔드 개발자" },
  { keywords: ["java", "developer"], result: "자바 개발자" },
  { keywords: ["java", "engineer"], result: "자바 개발자" },
  { keywords: ["python", "backend"], result: "백엔드 개발자" },
  { keywords: ["python", "engineer"], result: "백엔드 개발자" },
  { keywords: ["blockchain"], result: "블록체인 개발자" },
  { keywords: ["web developer"], result: "웹 개발자" },
  { keywords: ["web engineer"], result: "웹 개발자" },
  { keywords: ["devops"], result: "DevOps 엔지니어" },
  { keywords: ["sre"], result: "SRE 엔지니어" },
  { keywords: ["cloud"], result: "클라우드 엔지니어" },
  { keywords: ["infrastructure"], result: "인프라 엔지니어" },
  { keywords: ["automation engineer"], result: "자동화 엔지니어" },
  { keywords: ["qa"], result: "QA 엔지니어" },
  { keywords: ["test engineer"], result: "QA 엔지니어" },
  { keywords: ["quality assurance"], result: "QA 엔지니어" },
  { keywords: ["security engineer"], result: "보안 엔지니어" },

  // AI/데이터
  { keywords: ["machine learning"], result: "ML 엔지니어" },
  { keywords: ["ml engineer"], result: "ML 엔지니어" },
  { keywords: ["ai"], result: "AI 엔지니어" },
  { keywords: ["data scientist"], result: "데이터 사이언티스트" },
  { keywords: ["data analyst"], result: "데이터 분석가" },
  { keywords: ["data engineer"], result: "데이터 엔지니어" },
  { keywords: ["data entry"], result: "회계 담당자" },

  // 디자인
  { keywords: ["ux/ui"], result: "UI/UX 디자이너" },
  { keywords: ["ui/ux"], result: "UI/UX 디자이너" },
  { keywords: ["ux"], result: "UI/UX 디자이너" },
  { keywords: ["ui"], result: "UI/UX 디자이너" },
  { keywords: ["product designer"], result: "프로덕트 디자이너" },
  { keywords: ["digital product designer"], result: "프로덕트 디자이너" },
  { keywords: ["designer"], result: "디자이너" },

  // 마케팅
  { keywords: ["performance marketing"], result: "퍼포먼스 마케터" },
  { keywords: ["growth market"], result: "그로스 마케터" },
  { keywords: ["digital marketing"], result: "디지털 마케터" },
  { keywords: ["e-commerce"], result: "이커머스 담당자" },
  { keywords: ["ecom"], result: "이커머스 담당자" },
  { keywords: ["e commerce"], result: "이커머스 담당자" },
  { keywords: ["tiktok"], result: "마케터" },
  { keywords: ["paid media"], result: "광고 마케터" },
  { keywords: ["content"], result: "콘텐츠 마케터" },
  { keywords: ["social media"], result: "소셜 미디어 마케터" },
  { keywords: ["brand"], result: "마케터" },
  { keywords: ["marketing"], result: "마케터" },

  // HR/행정/회계
  { keywords: ["interpreter"], result: "통역사" },
  { keywords: ["accountant"], result: "회계 담당자" },
  { keywords: ["accounting"], result: "회계 담당자" },
  { keywords: ["finance"], result: "재무 담당자" },
  { keywords: ["hr"], result: "HR 담당자" },
  { keywords: ["human resource"], result: "HR 담당자" },
  { keywords: ["office manager"], result: "오피스 매니저" },
  { keywords: ["admin"], result: "행정 담당자" },
  { keywords: ["administrative"], result: "행정 담당자" },

  // PM
  { keywords: ["project manager"], result: "프로젝트 매니저" },
  { keywords: ["product manager"], result: "프로덕트 매니저" },
  { keywords: ["scrum master"], result: "스크럼 마스터" },

  // 소프트웨어 (가장 일반적이므로 마지막)
  { keywords: ["software"], result: "소프트웨어 개발자" },
  { keywords: ["developer"], result: "개발자" },
  { keywords: ["engineer"], result: "엔지니어" },
];

export function translateRole(role: string): string {
  if (!role) return role;

  // 이미 한국어인 경우
  const suffix = roleSuffixKR[role];
  if (suffix !== undefined) {
    return suffix ? `${role} ${suffix}` : role;
  }
  if (/[가-힣]/.test(role)) return role;

  // 키워드 매칭
  const lower = role.toLowerCase();
  for (const rule of keywordRules) {
    if (rule.keywords.every((kw) => lower.includes(kw))) {
      return rule.result;
    }
  }

  // 매칭 실패 시 원본 반환
  return role;
}

// 하위 호환
export function formatRoleTitle(role: string): string {
  return translateRole(role);
}
