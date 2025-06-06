import { useEffect, useState } from 'react'
import { fetchTopScores } from '../api/fetchTopScores'

type Score = {
  id: string
  nickname: string
  time: number
}

export default function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchTopScores()
      .then(setScores)
      .catch(() => alert('순위 정보를 가져올 수 없습니다.'))
  }, [])

  const visibleScores = showAll ? scores : scores.slice(0, 3)

  return (
    <div className="w-full max-w-md bg-white shadow rounded-xl p-4 my-4">
      <h2 className="text-xl font-bold mb-3 text-center">🏆 순위표 (TOP 50)</h2>
      <ul className="space-y-1">
        {visibleScores.map((s, i) => (
          <li key={s.id} className="flex justify-between px-2 py-1 bg-gray-50 rounded">
            <span className="font-mono">{(showAll ? i + 1 : i + 1)}.</span>
            <span className="font-bold text-blue-600">{s.nickname}</span>
            <span>{s.time}초</span>
          </li>
        ))}
      </ul>
      {!showAll && scores.length > 3 && (
        <button
          className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 rounded py-1 font-semibold"
          onClick={() => setShowAll(true)}
        >
          더보기
        </button>
      )}
      {showAll && scores.length > 3 && (
        <button
          className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-500 rounded py-1 font-normal"
          onClick={() => setShowAll(false)}
        >
          접기
        </button>
      )}
    </div>
  )
}
