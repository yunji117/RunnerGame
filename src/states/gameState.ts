// gameState.ts
import { atom } from 'recoil'

export const gameState = atom({
  key: 'gameState',
  default: {
    status: 'idle', 
    // 'idle' -> 대기 상태, 아직 게임 시작 전
    //  'playing' -> 게임 진행 중
    // 'gameover' -> 게임 종료 상태
    score: 0,
    nickname: '',
  }
})
