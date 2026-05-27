-- 희망 연봉을 KRW 단일값에서 VND 범위로 변경
-- salary_min_vnd, salary_max_vnd: 월급 기준 (Gross VND)
-- 값은 AI API (gpt-4.1-mini)로 인재 프로필 기반 개별 추정

ALTER TABLE talents ADD COLUMN IF NOT EXISTS salary_min_vnd bigint;
ALTER TABLE talents ADD COLUMN IF NOT EXISTS salary_max_vnd bigint;
