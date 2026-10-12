import { getSupabaseClient } from './supabase'
import type { Score } from './types'

export async function fetchTopScores(): Promise<Score[]> {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('scores')
    .select('id, nickname, time')
    .order('time', { ascending: false })
    .limit(50)

  if (error) throw error
  return data ?? []
}
