import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)

    if (session) {
      const { access_token, refresh_token } = session

      // 프로필 확인: 승인된 유저만 /talents로, 나머지는 /login으로
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('status')
        .eq('id', session.user.id)
        .single()

      const destination = profile?.status === 'approved' ? '/talents' : '/login'

      // 브라우저 supabase 클라이언트가 세션을 인식하도록 토큰을 hash로 전달
      return NextResponse.redirect(
        `${origin}${destination}#access_token=${access_token}&refresh_token=${refresh_token}&type=bearer`
      )
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}
