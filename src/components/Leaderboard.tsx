import { useEffect, useState } from 'react'
import { fetchTopScores } from '../api/fetchTopScores'

type Score = {
  id: string
  nickname: string
  time: number
}

export default function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([])

  useEffect(() => {
    fetchTopScores()
      .then(setScores)
      .catch(() => alert('순위 정보를 가져올 수 없습니다.'))
  }, [])

  return (
    <div className="w-full max-w-md bg-white shadow rounded-xl p-4 my-4">
      <h2 className="text-xl font-bold mb-3 text-center">🏆 순위표 (TOP 50)</h2>
      <ul className="space-y-1">
        {scores.map((s, i) => (
          <li key={s.id} className="flex justify-between px-2 py-1 bg-gray-50 rounded">
            <span className="font-mono">{i + 1}.</span>
            <span className="font-bold text-blue-600">{s.nickname}</span>
            <span>{s.time}초</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
