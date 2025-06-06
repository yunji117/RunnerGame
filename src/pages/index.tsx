import { useRecoilValue } from 'recoil'
import { gameState } from '../states/gameState'
import StartButton from '../components/StartButton'
import GameCanvas from '../components/GameCanvas'
import GameOverModal from '../components/GameOverModal'
import Leaderboard from '../components/Leaderboard'

export default function GamePage() {
  const game = useRecoilValue(gameState)

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-4 space-y-6">
      {/* 게임 영역 */}
      <div className="relative w-full max-w-4xl h-[400px] bg-white shadow-md rounded-lg flex items-center justify-center overflow-hidden">
        <GameCanvas />
        {game.status === 'idle' && (
          <div className="absolute z-10">
            <StartButton />
          </div>
        )}
        {game.status === 'gameover' && (
          <div className="absolute z-10">
            <GameOverModal />
          </div>
        )}
        <div className="absolute top-3 right-4 text-gray-600 text-sm font-mono z-20">
          Time: {game.score.toString().padStart(2, '0')}초
        </div>
      </div>

      {/* 순위표 */}
      <Leaderboard />
    </div>
  )
}
