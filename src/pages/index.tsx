import { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { gameState } from '../states/gameState'
import StartButton from '../components/StartButton'
import GameCanvas from '../components/GameCanvas'
import GameOverModal from '../components/GameOverModal'
import Leaderboard from '../components/Leaderboard'

export default function GamePage() {
  const game = useRecoilValue(gameState)
  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0)
  const [hasJumped, setHasJumped] = useState(false)

  useEffect(() => {
    if (game.status !== 'playing') setHasJumped(false)
  }, [game.status])

  const handleFirstJump = useCallback(() => setHasJumped(true), [])

  return (
    <main className="flex min-h-screen w-full flex-col items-center space-y-4 bg-gray-100 p-2 sm:space-y-6 sm:p-4">
      <div className="mobile-game-position flex w-full justify-center">
        <section className="relative aspect-square w-full max-w-md overflow-hidden rounded-lg bg-white shadow-md sm:aspect-[2/1] sm:max-w-4xl">
          <GameCanvas onFirstJump={handleFirstJump} />
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
          {game.status === 'playing' && !hasJumped && (
            <p className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-black/55 px-3 py-1.5 text-xs text-white sm:left-4 sm:translate-x-0">
              스페이스바 또는 화면 터치로 2단 점프
            </p>
          )}
        </section>
      </div>

      <Leaderboard refreshKey={leaderboardRefreshKey} />
    </main>
  )
}
