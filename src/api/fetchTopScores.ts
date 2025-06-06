// src/api/fetchTopScores.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

export async function fetchTopScores() {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('time', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}
