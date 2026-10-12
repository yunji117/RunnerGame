import { useCallback, useEffect, useState } from 'react'
import { fetchTopScores } from '../api/fetchTopScores'
import { isSupabaseConfigured } from '../api/supabase'
import type { Score } from '../api/types'

function getErrorMessage(error: unknown) {
  if (!isSupabaseConfigured()) {
    return '게임은 정상적으로 이용할 수 있지만, Supabase 재연결 전까지 순위표는 중지됩니다.'
  }
  if (error instanceof Error && error.message) return error.message
  return '순위 정보를 가져오지 못했습니다.'
}

type LeaderboardProps = {
  refreshKey: number
}

export default function Leaderboard({ refreshKey }: LeaderboardProps) {
  const [scores, setScores] = useState<Score[]>([])
  const [showAll, setShowAll] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const loadScores = useCallback(async () => {
    setIsLoading(true)
    setLoadError('')
    try {
      setScores(await fetchTopScores())
    } catch (error) {
      console.error('순위 정보를 가져오지 못했습니다.', error)
      setLoadError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadScores()
  }, [loadScores, refreshKey])

  const visibleScores = showAll ? scores : scores.slice(0, 3)

  return (
    <section className="my-4 w-full max-w-md rounded-xl bg-white p-4 text-gray-900 shadow">
      <h2 className="mb-3 text-center text-xl font-bold">🏆 순위표 (TOP 50)</h2>

      {isLoading && <p className="py-3 text-center text-sm text-gray-500">불러오는 중…</p>}
      {loadError && (
        <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900" role="status">
          <p>{loadError}</p>
          {isSupabaseConfigured() && (
            <button
              className="mt-2 rounded bg-amber-100 px-3 py-1 font-semibold hover:bg-amber-200"
              onClick={() => void loadScores()}
              type="button"
            >
              다시 시도
            </button>
          )}
        </div>
      )}

      {!isLoading && !loadError && scores.length === 0 && (
        <p className="py-3 text-center text-sm text-gray-500">아직 등록된 점수가 없습니다.</p>
      )}

      <ol className="space-y-1">
        {visibleScores.map((score, index) => (
          <li
            key={score.id}
            className="grid grid-cols-[2rem_1fr_auto] items-center rounded bg-gray-50 px-2 py-1"
          >
            <span className="font-mono">{index + 1}.</span>
            <span className="truncate font-bold text-blue-600">{score.nickname}</span>
            <span>{score.time}초</span>
          </li>
        ))}
      </ol>

      {scores.length > 3 && (
        <button
          className="mt-2 w-full rounded bg-gray-100 py-1 font-semibold text-gray-700 hover:bg-gray-200"
          onClick={() => setShowAll((current) => !current)}
          type="button"
        >
          {showAll ? '접기' : '더보기'}
        </button>
      )}
    </section>
  )
}
