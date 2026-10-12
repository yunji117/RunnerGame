import { getSupabaseClient } from './supabase'
import { RUNNER_GAME_SCORES_TABLE } from './constants'

export async function insertScore(nickname: string, time: number) {
  const supabase = await getSupabaseClient()
  const { error } = await supabase
    .from(RUNNER_GAME_SCORES_TABLE)
    .insert([{ nickname: nickname.trim(), time: Math.max(0, Math.floor(time)) }])

  if (error) throw error
}
