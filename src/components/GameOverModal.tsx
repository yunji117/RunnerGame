import { useState, type FormEvent } from 'react'
import { useRecoilState } from 'recoil'
import { insertScore } from '../api/insertScore'
import { isSupabaseConfigured } from '../api/supabase'
import { gameState } from '../states/gameState'

const bannedWords = [
  'fuck',
  'shit',
  '바보',
  '멍청이',
  '개새',
  '병신',
  '씨발',
  '존',
  'ㅅㅂ',
  'ㅄ',
  'ㅂㅅ',
  'qudtls',
  'tlqkf',
]

export default function GameOverModal() {
  const [game, setGame] = useRecoilState(gameState)
  const [nickname, setNickname] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const restart = () => setGame({ status: 'playing', score: 0 })
  const close = () => setGame({ status: 'idle', score: 0 })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedNickname = nickname.trim()

    if (!normalizedNickname) {
      setSaveError('닉네임을 입력해주세요.')
      return
    }
    if (bannedWords.some((word) => normalizedNickname.toLowerCase().includes(word))) {
      setSaveError('닉네임에 사용할 수 없는 단어가 포함되어 있습니다.')
      return
    }

    setIsSaving(true)
    setSaveError('')
    try {
      await insertScore(normalizedNickname, game.score)
      close()
    } catch (error) {
      console.error('점수를 저장하지 못했습니다.', error)
      setSaveError(
        isSupabaseConfigured()
          ? '점수 저장에 실패했습니다. 연결 상태를 확인해주세요.'
          : 'Supabase 재연결 전까지 점수를 저장할 수 없습니다.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        aria-labelledby="game-over-title"
        aria-modal="true"
        className="w-80 rounded-xl bg-white p-6 text-center text-gray-900 shadow-xl"
        role="dialog"
      >
        <h2 id="game-over-title" className="mb-2 text-2xl font-bold text-red-600">
          GAME OVER
        </h2>
        <p className="mb-4">시간: {game.score}초</p>

        <form onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            type="text"
            placeholder="닉네임을 입력하세요"
            className="mb-2 w-full rounded border p-2"
            value={nickname}
            maxLength={20}
            autoComplete="off"
            onChange={(event) => setNickname(event.target.value.replace(/`/g, ''))}
          />
          {saveError && <p className="mb-2 text-left text-sm text-red-600" role="alert">{saveError}</p>}
          <button
            type="submit"
            disabled={isSaving}
            className="mb-2 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? '저장 중…' : '점수 저장'}
          </button>
        </form>

        <button
          onClick={restart}
          type="button"
          className="mb-2 w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          다시 하기
        </button>
        <button
          onClick={close}
          type="button"
          className="w-full rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
        >
          닫기
        </button>
      </div>
    </div>
  )
}
