import { useRecoilState } from 'recoil'
import { gameState } from '../states/gameState'
import { insertScore } from '../api/insertScore'
import { useState } from 'react'

export default function GameOverModal() {
  const [game, setGame] = useRecoilState(gameState)
  const [nickname, setNickname] = useState('')

  // 금지어 리스트 (원하는 단어 추가)
  const bannedWords = ['fuck', 'shit', '바보', '멍청이', '개새', '병신', '씨발', '좆', 'ㅅㅂ', 'ㅄ', 'ㅂㅅ', '애','qudtls','tlqkf']

  const handleSubmit = async () => {
    if (!nickname.trim()) return alert('닉네임을 입력해주세요!')
    // 금지어 검사
    if (bannedWords.some(word => nickname.includes(word))) {
      alert('닉네임에 사용할 수 없는 단어가 포함되어 있습니다.')
      return
    }
    try {
      await insertScore(nickname, game.score)
      setGame({ status: 'idle', score: 0, nickname: '' })
      window.location.reload() // 점수 저장 후 페이지 새로고침
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
          onChange={(e) => {
            // 백틱(`) 입력 방지
            const value = e.target.value.replace(/`/g, '')
            setNickname(value)
          }}
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
