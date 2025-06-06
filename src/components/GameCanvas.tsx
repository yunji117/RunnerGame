import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { useRecoilState } from 'recoil'
import { gameState } from '../states/gameState'

export default function GameCanvas() {
  const [game, setGame] = useRecoilState(gameState)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (game.status !== 'playing') return // 게임 상태가 playing일 때만 시작

    const app = new PIXI.Application({
      width: 800,
      height: 400,
      backgroundColor: 0xf4f4f4,
    })

    if (canvasRef.current) {
      canvasRef.current.innerHTML = ''
      canvasRef.current.appendChild(app.view as HTMLCanvasElement)
      canvasRef.current.focus()
    }

    const dino = new PIXI.Graphics()
    dino.beginFill(0x333333)
    dino.drawRect(0, 0, 50, 50)
    dino.endFill()
    dino.x = 100
    dino.y = 300
    app.stage.addChild(dino)

    const groundY = 300
    let velocityY = 0
    const gravity = 0.7
    const jumpPower = -13
    let isJumping = false
    let jumpCount = 0 // 점프 횟수(더블점프 구현)
    let score = 0
    let obstacleSpeed = 3

    // 장애물 여러 개 관리
    const MAX_OBSTACLES = 3
    const obstacles: PIXI.Graphics[] = []
    const obstacleStates: { x: number }[] = []
    for (let i = 0; i < MAX_OBSTACLES; i++) {
      const obs = new PIXI.Graphics()
      obs.beginFill(0xff4444)
      obs.drawRect(0, 0, 30, 50)
      obs.endFill()
      // 각 장애물의 시작 위치를 랜덤하게 배치
      const minGap = 100
      const maxGap = 300
      const gap = 300 + i * 200 + Math.random() * (maxGap - minGap)
      obs.x = 800 + gap
      obs.y = groundY
      obstacles.push(obs)
      obstacleStates.push({ x: obs.x })
      app.stage.addChild(obs)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && jumpCount < 2) {
        velocityY = jumpPower
        isJumping = true
        jumpCount++
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    const ticker = app.ticker.add(() => {
      // 중력 적용
      if (dino.y < groundY || velocityY < 0) {
        velocityY += gravity
        dino.y += velocityY
      } else {
        dino.y = groundY
        velocityY = 0
        isJumping = false
        jumpCount = 0 // 착지 시 점프 횟수 초기화
      }

      // 장애물 속도 증가 (최대 20까지)
      obstacleSpeed = Math.min(5 + Math.floor(score / (60 * 5)), 20)
      // 장애물들 이동 및 재배치
      for (let i = 0; i < MAX_OBSTACLES; i++) {
        obstacleStates[i].x -= obstacleSpeed
        if (obstacleStates[i].x < -30) {
          // 앞 장애물과의 간격을 고려해 재배치
          const minGap = 100
          const maxGap = 300
          // 마지막 장애물의 x 위치를 기준으로 간격 확보
          let prevIdx = (i - 1 + MAX_OBSTACLES) % MAX_OBSTACLES
          let prevX = obstacleStates[prevIdx].x
          let baseX = Math.max(800, prevX + minGap)
          obstacleStates[i].x = baseX + minGap + Math.random() * (maxGap - minGap)
        }
        obstacles[i].x = obstacleStates[i].x
      }
      // 충돌 판정 (여러 장애물)
      for (let i = 0; i < MAX_OBSTACLES; i++) {
        if (
          dino.x + 50 > obstacles[i].x &&
          dino.x < obstacles[i].x + 30 &&
          dino.y + 50 > obstacles[i].y
        ) {
          setGame((prev) => ({ ...prev, status: 'gameover', score }))
          ticker.stop()
          window.removeEventListener('keydown', handleKeyDown)
          if (app.stage) app.stage.removeChildren()
          try {
            app.destroy(true)
          } catch (e) {
            console.warn('Pixi destroy error', e)
          }
        }
      }
      score++
      setGame((prev) => ({ ...prev, score }))
    })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      ticker.stop()
      if (app.stage) app.stage.removeChildren()
      try {
        app.destroy(true)
      } catch (e) {
        console.warn('Pixi destroy error', e)
      }
    }
  }, [game.status])

  return <div ref={canvasRef} className="w-full h-full" tabIndex={0} />
}
