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
    let score = 0

    const obstacle = new PIXI.Graphics()
    obstacle.beginFill(0xff4444)
    obstacle.drawRect(0, 0, 30, 50)
    obstacle.endFill()
    obstacle.x = 800
    obstacle.y = groundY
    app.stage.addChild(obstacle)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isJumping) {
        velocityY = jumpPower
        isJumping = true
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
      }

      // 장애물 이동
      obstacle.x -= 5
      if (obstacle.x < -30) {
        obstacle.x = 800 + Math.random() * 200
      }

      // 충돌 판정
      if (
        dino.x + 50 > obstacle.x &&
        dino.x < obstacle.x + 30 &&
        dino.y + 50 > obstacle.y
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
