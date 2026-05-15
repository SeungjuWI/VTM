-- admin/super_admin이 interview_requests 상태를 업데이트할 수 있는 정책
create policy "interview_requests_admin_update" on interview_requests
  for update using (
    exists (
      select 1 from user_profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );
