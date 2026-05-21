import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { Talent } from './types'

// ISR/SSG 호환 클라이언트 (cache: 'no-store' 없음 → Next.js revalidate 사용)
const supabaseISR = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function fetchTalents(): Promise<Talent[]> {
  const { data, error } = await supabaseISR
    .from('talents')
    .select('*')
    .eq('published', true)
    .order('ovr_score', { ascending: false })

  if (error) {
    console.error('fetchTalents error:', error.message)
    return []
  }

  return data as Talent[]
}

export async function fetchTalentById(id: string): Promise<Talent | null> {
  const { data, error } = await supabaseISR
    .from('talents')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('fetchTalentById error:', error.message)
    return null
  }

  return data as Talent
}

export async function submitInterviewRequest(req: {
  talent_id: string
  company_name: string
  contact_name: string
  contact_email: string
  message?: string
}) {
  const { data, error } = await supabase
    .from('interview_requests')
    .insert({ ...req, status: 'received' })
    .select()
    .single()

  if (error) {
    console.error('submitInterviewRequest error:', error.message)
    return { data: null, error }
  }

  return { data, error: null }
}
