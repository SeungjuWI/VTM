-- interview_sessions에 지원 포지션 컬럼 추가
ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS applied_position text;
