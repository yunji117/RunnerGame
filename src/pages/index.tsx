import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { gameState } from '../states/gameState'
import StartButton from '../components/StartButton'
import GameCanvas from '../components/GameCanvas'
import GameOverModal from '../components/GameOverModal'
import Leaderboard from '../components/Leaderboard'

export default function GamePage() {
  const game = useRecoilValue(gameState)
  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0)

  return (
    <main className="flex min-h-screen w-full flex-col items-center space-y-6 bg-gray-100 p-4">
      <section className="relative aspect-[2/1] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-md">
        <GameCanvas />
        {game.status === 'idle' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <StartButton />
          </div>
        )}
        {game.status === 'gameover' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <GameOverModal
              onScoreSaved={() => setLeaderboardRefreshKey((key) => key + 1)}
            />
          </div>
        )}
        <div className="absolute right-4 top-3 z-20 rounded bg-black/45 px-2 py-1 font-mono text-sm text-white">
          시간: {game.score.toString().padStart(2, '0')}초
        </div>
        {game.status === 'playing' && (
          <p className="pointer-events-none absolute bottom-3 left-4 z-20 rounded bg-black/45 px-2 py-1 text-xs text-white">
            스페이스바 또는 화면 터치로 2단 점프
          </p>
        )}
      </section>

      <Leaderboard refreshKey={leaderboardRefreshKey} />
    </main>
  )
}
