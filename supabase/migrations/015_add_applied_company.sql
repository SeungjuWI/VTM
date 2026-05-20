-- interview_sessions에 지원 회사 컬럼 추가
ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS applied_company text;
