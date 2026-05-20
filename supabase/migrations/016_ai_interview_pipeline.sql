-- 폰인터뷰 → AI 인터뷰 파이프라인 전환
-- interview_sessions에 candidate_id 추가하여 candidates 테이블과 연결
ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS candidate_id uuid;

-- candidates 파이프라인 상태에 AI 인터뷰 상태 추가
-- 기존: passed → phone_interview_pending → phone_interview_done → final_passed
-- 신규: passed → ai_interview_sent → ai_interview_done → final_passed
