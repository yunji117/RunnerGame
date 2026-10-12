import { atom } from 'recoil'

export type GameStatus = 'idle' | 'playing' | 'gameover'

export type GameState = {
  status: GameStatus
  score: number
}

export const gameState = atom<GameState>({
  key: 'gameState',
  default: {
    status: 'idle',
    score: 0,
  },
})
