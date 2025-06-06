import { useRecoilState } from 'recoil'
import { gameState } from '../states/gameState'
import { insertScore } from '../api/insertScore'
import { useState } from 'react'

export default function GameOverModal() {
  const [game, setGame] = useRecoilState(gameState)
  const [nickname, setNickname] = useState('')

  const handleSubmit = async () => {
    if (!nickname.trim()) return alert('닉네임을 입력해주세요!')
    try {
      await insertScore(nickname, game.score)
      setGame({ status: 'idle', score: 0, nickname: '' })
    } catch (err) {
      alert('점수 저장 실패')
    }
  }

  const handleClose = () => {
    setGame({ status: 'idle', score: 0, nickname: '' })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center w-80">
        <h2 className="text-2xl font-bold mb-2 text-red-600">GAME OVER</h2>
        <p className="mb-4">시간: {game.score} 초</p>
        <input
          type="text"
          placeholder="닉네임을 입력하세요"
          className="border p-2 rounded w-full mb-3"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mb-2"
        >
          점수 저장
        </button>
        <button
          onClick={handleClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 w-full"
        >
          닫기
        </button>
      </div>
    </div>
  )
}
