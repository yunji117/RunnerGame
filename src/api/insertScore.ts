import { getSupabaseClient } from './supabase'

export async function insertScore(nickname: string, time: number) {
  const supabase = await getSupabaseClient()
  const { error } = await supabase
    .from('scores')
    .insert([{ nickname: nickname.trim(), time: Math.max(0, Math.floor(time)) }])

  if (error) throw error
}
