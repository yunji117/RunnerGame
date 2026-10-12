import { getSupabaseClient } from './supabase'
import type { Score } from './types'
import { RUNNER_GAME_SCORES_TABLE } from './constants'

export async function fetchTopScores(): Promise<Score[]> {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from(RUNNER_GAME_SCORES_TABLE)
    .select('id, nickname, time')
    .order('time', { ascending: false })
    .limit(50)

  if (error) throw error
  return data ?? []
}
