import { useSetRecoilState } from 'recoil'
import { gameState } from '../states/gameState'

export default function StartButton() {
  const setGame = useSetRecoilState(gameState)

  const startGame = () => {
    setGame((prev) => ({
      ...prev,
      status: 'playing',
      score: 0,
      nickname: '',
    }))
  }

  return (
    <button
      onClick={startGame}
      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-md"
    >
      게임 시작!
    </button>
  )
}
