-- interview_sessions에 데드라인 컬럼 추가
ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS deadline timestamptz;
