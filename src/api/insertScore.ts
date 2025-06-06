import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

export async function insertScore(nickname: string, time: number) {
  const { error } = await supabase
    .from('scores')
    .insert([{ nickname, time }])

  if (error) throw error
}
