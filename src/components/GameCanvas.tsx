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

    const bg = PIXI.Sprite.from('/img/bgimgg.svg')
    bg.width = app.view.width  
    bg.height = app.view.height
    bg.x = 0
    bg.y = 0
    app.stage.addChild(bg)

    const human = PIXI.Sprite.from('/img/uk.svg') 
    human.width = 50
    human.height = 70
    human.x = 100
    human.y = 300
    app.stage.addChild(human)

    const groundY = 280
    let velocityY = 0
    const gravity = 0.7
    const jumpPower = -13
    let jumpCount = 0 // 점프 횟수(더블점프 구현)
    let score = 0
    let obstacleSpeed = 3

    // 장애물 여러 개 관리
    const MAX_OBSTACLES = 3
    const obstacles: PIXI.Sprite[] = []
    const obstacleStates: { x: number }[] = []
    // 장애물 이미지 경로 배열
    const obstacleImages = [
      '/img/facebook.svg',
      '/img/instar.svg',
      '/img/soju.svg',
      '/img/beer.svg',
    ]
    for (let i = 0; i < MAX_OBSTACLES; i++) {
      const imgIdx = Math.floor(Math.random() * obstacleImages.length)
      const obs = PIXI.Sprite.from(obstacleImages[imgIdx])
      obs.width = 50
      obs.height = 50
      const minGap = 100
      const maxGap = 300
      const gap = 300 + i * 200 + Math.random() * (maxGap - minGap)
      obs.x = 800 + gap
      obs.y = groundY + 20
      obstacles.push(obs)
      obstacleStates.push({ x: obs.x })
      app.stage.addChild(obs)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && jumpCount < 2) {
        velocityY = jumpPower
        jumpCount++
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    const ticker = app.ticker.add(() => {
      if (human.y < groundY || velocityY < 0) {
        velocityY += gravity
        human.y += velocityY
      } else {
        human.y = groundY
        velocityY = 0
        jumpCount = 0 // 착지 시 점프 횟수 초기화
      }

      obstacleSpeed = Math.min(5 + Math.floor(score / (60 * 5)), 20)

      for (let i = 0; i < MAX_OBSTACLES; i++) {
        obstacleStates[i].x -= obstacleSpeed
        if (obstacleStates[i].x < -30) {
          const minGap = 100
          const maxGap = 300
          let prevIdx = (i - 1 + MAX_OBSTACLES) % MAX_OBSTACLES
          let prevX = obstacleStates[prevIdx].x
          let baseX = Math.max(800, prevX + minGap)
          obstacleStates[i].x = baseX + minGap + Math.random() * (maxGap - minGap)
        }
        obstacles[i].x = obstacleStates[i].x
      }

      for (let i = 0; i < MAX_OBSTACLES; i++) {
        if (
          human.x + 50 > obstacles[i].x &&
          human.x < obstacles[i].x + 30 &&
          human.y + 50 > obstacles[i].y
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
