/**
 * 이미 엉킨 분류 데이터 백필.
 * applied_job의 JD 코드를 기준으로 회사/포지션을 표준화한다.
 *   - interview_sessions.applied_company / applied_position
 *   - candidates.applied_company
 * (candidates.applied_job 원본은 건드리지 않음 — 코드 해석의 소스라서 보존)
 *
 * 사용법:
 *   npx tsx scripts/backfill-jd-classification.ts            # dry-run (변경 미리보기만)
 *   npx tsx scripts/backfill-jd-classification.ts --apply    # 실제 DB 반영
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import { loadAllJDs, resolveJD } from "../lib/jd-data";

const APPLY = process.argv.includes("--apply");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Supabase 기본 1000행 제한 회피: 전체 페이지네이션 로드
async function fetchAll<T>(table: string, columns: string): Promise<T[]> {
  const out: T[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase.from(table).select(columns).range(from, from + PAGE - 1);
    if (error) throw error;
    out.push(...((data as T[]) || []));
    if (!data || data.length < PAGE) break;
  }
  return out;
}

async function main() {
  console.log(APPLY ? "\n*** APPLY 모드: 실제 DB에 반영합니다 ***\n" : "\n--- DRY-RUN: 변경 미리보기만 (쓰기 없음) ---\n");

  const allJDs = await loadAllJDs(supabase);

  // 후보자 로드 (전체)
  type Cand = { id: string; applied_job: string | null; applied_company: string | null };
  const candidates = await fetchAll<Cand>("candidates", "id, applied_job, applied_company");
  const candMap = new Map(candidates.map((c) => [c.id, c]));

  // ===== 1) interview_sessions 백필 =====
  type Sess = { id: string; candidate_id: string; applied_company: string | null; applied_position: string | null };
  const sessions = await fetchAll<Sess>("interview_sessions", "id, candidate_id, applied_company, applied_position");

  const sessionUpdates: { id: string; applied_company: string; applied_position: string; before: string }[] = [];
  let sessionUnresolved = 0;
  for (const s of sessions) {
    const cand = candMap.get(s.candidate_id);
    const jd = resolveJD(cand?.applied_job, allJDs);
    if (!jd) { sessionUnresolved++; continue; }
    if (s.applied_company !== jd.company || s.applied_position !== jd.position) {
      sessionUpdates.push({
        id: s.id,
        applied_company: jd.company,
        applied_position: jd.position,
        before: `company="${s.applied_company ?? "∅"}" position="${s.applied_position ?? "∅"}"`,
      });
    }
  }

  // ===== 2) candidates.applied_company 백필 =====
  const candUpdates: { id: string; applied_company: string; before: string }[] = [];
  let candUnresolved = 0;
  const unresolvedSamples: Record<string, number> = {};
  for (const c of candidates) {
    const jd = resolveJD(c.applied_job, allJDs);
    if (!jd) {
      candUnresolved++;
      const k = c.applied_job ?? "∅";
      unresolvedSamples[k] = (unresolvedSamples[k] || 0) + 1;
      continue;
    }
    if (c.applied_company !== jd.company) {
      candUpdates.push({ id: c.id, applied_company: jd.company, before: `"${c.applied_company ?? "∅"}"` });
    }
  }

  // ===== 리포트 =====
  console.log(`[interview_sessions] 총 ${sessions.length}건 / 변경대상 ${sessionUpdates.length}건 / 코드해석불가 ${sessionUnresolved}건`);
  const sampleS = sessionUpdates.slice(0, 15);
  for (const u of sampleS) console.log(`   ${u.before}\n      → company="${u.applied_company}" position="${u.applied_position}"`);
  if (sessionUpdates.length > sampleS.length) console.log(`   ... 외 ${sessionUpdates.length - sampleS.length}건`);

  console.log(`\n[candidates.applied_company] 총 ${candidates.length}건 / 변경대상 ${candUpdates.length}건 / 코드해석불가 ${candUnresolved}건`);
  const sampleC = candUpdates.slice(0, 15);
  for (const u of sampleC) console.log(`   ${u.before} → "${u.applied_company}"`);
  if (candUpdates.length > sampleC.length) console.log(`   ... 외 ${candUpdates.length - sampleC.length}건`);

  console.log(`\n[해석불가 — 그대로 둠] applied_job 원본값 분포:`);
  Object.entries(unresolvedSamples).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`   ${v.toString().padStart(4)}  "${k}"`));

  if (!APPLY) {
    console.log("\n--- DRY-RUN 종료. 실제 반영하려면 --apply 플래그를 붙이세요. ---\n");
    return;
  }

  // ===== 실제 반영 =====
  console.log("\n반영 중...");
  let ok = 0, fail = 0;
  for (const u of sessionUpdates) {
    const { error } = await supabase
      .from("interview_sessions")
      .update({ applied_company: u.applied_company, applied_position: u.applied_position })
      .eq("id", u.id);
    if (error) { fail++; console.error(`  session ${u.id}: ${error.message}`); } else ok++;
  }
  for (const u of candUpdates) {
    const { error } = await supabase
      .from("candidates")
      .update({ applied_company: u.applied_company })
      .eq("id", u.id);
    if (error) { fail++; console.error(`  candidate ${u.id}: ${error.message}`); } else ok++;
  }
  console.log(`\n완료: 성공 ${ok}건 / 실패 ${fail}건\n`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
