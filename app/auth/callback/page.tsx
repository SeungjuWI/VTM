"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("Auth callback error:", error.message);
          // code 교환 실패 시 기존 세션이 있는지 확인
          const { data: { session: existingSession } } = await supabase.auth.getSession();
          if (existingSession) {
            return redirectByProfile(existingSession.user.id);
          }
          window.location.href = "/login";
          return;
        }

        if (session) {
          return redirectByProfile(session.user.id);
        }
      }

      // code 없으면 기존 세션 확인
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (existingSession) {
        return redirectByProfile(existingSession.user.id);
      }

      window.location.href = "/login";
    }

    async function redirectByProfile(userId: string) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("status, role")
        .eq("id", userId)
        .single();

      if (profile?.role === "super_admin" || profile?.role === "admin") {
        window.location.href = "/admin";
      } else if (profile?.status === "approved") {
        window.location.href = "/talents";
      } else {
        window.location.href = "/login";
      }
    }

    handleCallback();
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
      <p className="text-[14px] text-gray-500">로그인 처리 중...</p>
    </main>
  );
}
