/* 읽기 전용 진단: 분류/중복 원인 확인. npx tsx scripts/diag-classification.ts */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function code(s: string | null): string {
  if (!s) return "(빈값)";
  const m = s.match(/^([A-Z]+\d+)/);
  return m ? m[1] : `(코드없음: "${s}")`;
}

async function main() {
  // 1) candidates.applied_job / applied_company 분포
  const { data: cands } = await supabase
    .from("candidates")
    .select("applied_job, applied_company, pipeline_status");

  console.log("\n=== candidates: applied_job 코드 추출 결과 (전체) ===");
  const codeCount: Record<string, number> = {};
  const rawJob: Record<string, number> = {};
  for (const c of cands || []) {
    codeCount[code(c.applied_job)] = (codeCount[code(c.applied_job)] || 0) + 1;
    const key = `${c.applied_job ?? "∅"}  ||  company=${c.applied_company ?? "∅"}`;
    rawJob[key] = (rawJob[key] || 0) + 1;
  }
  console.log("[코드 추출 분포]");
  Object.entries(codeCount).sort().forEach(([k, v]) => console.log(`  ${v.toString().padStart(4)}  ${k}`));

  console.log("\n[applied_job 원본 + applied_company 조합 (상위 다양성)]");
  Object.entries(rawJob).sort((a, b) => b[1] - a[1]).slice(0, 40).forEach(([k, v]) => console.log(`  ${v.toString().padStart(4)}  ${k}`));

  // 2) interview_sessions.applied_company / applied_position 분포 (전달 화면이 쓰는 키)
  const { data: sess } = await supabase
    .from("interview_sessions")
    .select("applied_company, applied_position");

  console.log("\n=== interview_sessions: applied_company 원본값 분포 (전달화면 그룹핑 키) ===");
  const sc: Record<string, number> = {};
  for (const s of sess || []) {
    const key = `company="${s.applied_company ?? "∅"}"  position="${s.applied_position ?? "∅"}"`;
    sc[key] = (sc[key] || 0) + 1;
  }
  Object.entries(sc).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${v.toString().padStart(4)}  ${k}`));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
