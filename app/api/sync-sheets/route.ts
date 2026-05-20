import { createClient } from "@supabase/supabase-js";
import { fetchAllCandidates } from "@/lib/google-sheets";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(data: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      try {
        send({ type: "status", message: "시트 데이터 불러오는 중..." });
        const allCandidates = await fetchAllCandidates();

        const candidates = allCandidates;

        const total = candidates.length;
        send({ type: "status", message: `전체 ${total}명. DB 저장 시작...`, total });

        const supabase = getSupabaseAdmin();
        let inserted = 0;
        let updated = 0;
        let skipped = 0;
        let errors = 0;

        // 기존 후보자의 식별자 + pipeline_status 조회
        send({ type: "status", message: "기존 후보자 조회 중..." });
        const { data: existing } = await supabase
          .from("candidates")
          .select("sheet_source, sheet_row_identifier, pipeline_status");

        const existingMap = new Map<string, string>();
        (existing || []).forEach((e) => {
          if (e.sheet_row_identifier) {
            existingMap.set(`${e.sheet_source}::${e.sheet_row_identifier}`, e.pipeline_status);
          }
        });

        send({ type: "status", message: `기존 ${existingMap.size}명 확인. 동기화 시작...` });

        // 새 후보자만 insert, 기존은 pipeline_status 외 정보만 update
        const BATCH_SIZE = 50;
        for (let i = 0; i < total; i += BATCH_SIZE) {
          const chunk = candidates.slice(i, i + BATCH_SIZE);
          const newRows = [];
          const updateRows = [];

          for (const c of chunk) {
            const key = `${c.sheet_source}::${c.sheet_row_identifier}`;
            const existingStatus = existingMap.get(key);
            const row = {
              full_name: c.full_name,
              email: c.email || null,
              phone: c.phone || null,
              city: c.city || null,
              university: c.university || null,
              graduation_year: c.graduation_year || null,
              position: c.position || null,
              yoe: c.yoe || null,
              cv_url: c.cv_url || null,
              portfolio_url: c.portfolio_url || null,
              skills: c.skills || null,
              source: c.source,
              applied_date: c.applied_date || null,
              applied_job: c.applied_job || null,
              applied_company: c.applied_company || null,
              sheet_source: c.sheet_source,
              sheet_row_identifier: c.sheet_row_identifier,
              updated_at: new Date().toISOString(),
            };

            if (existingStatus === undefined) {
              newRows.push(row);
            } else if (existingStatus === "new") {
              // 아직 처리 안 된 후보자만 정보 업데이트
              updateRows.push(row);
            } else {
              // 이미 스크리닝/합격/불합격 등 진행된 후보자는 스킵
              skipped++;
            }
          }

          // 새 후보자 insert
          if (newRows.length > 0) {
            const { error } = await supabase.from("candidates").insert(newRows);
            if (error) errors += newRows.length;
            else inserted += newRows.length;
          }

          // 대기 상태 후보자 정보 업데이트 (pipeline_status 건드리지 않음)
          for (const row of updateRows) {
            const { error } = await supabase
              .from("candidates")
              .update(row)
              .eq("sheet_source", row.sheet_source)
              .eq("sheet_row_identifier", row.sheet_row_identifier);
            if (error) errors++;
            else updated++;
          }

          const progress = Math.min(100, Math.round(((i + chunk.length) / total) * 100));
          send({ type: "progress", progress, inserted, errors, total });
        }

        send({
          type: "done",
          total,
          inserted,
          updated,
          skipped,
          errors,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        send({ type: "error", message });
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
