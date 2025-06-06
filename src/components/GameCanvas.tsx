// GameCanvas.tsx
import * as PIXI from 'pixi.js'
import { useEffect, useRef } from 'react'
import { useSetRecoilState } from 'recoil'
import { gameState } from '../states/gameState'

export default function GameCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const setGame = useSetRecoilState(gameState)

  useEffect(() => {
    const app = new PIXI.Application({ width: 800, height: 400, backgroundColor: 0xf4f4f4 })
    canvasRef.current?.appendChild(app.view as HTMLCanvasElement)

    const gravity = 0.7
    const jumpPower = -13
    let velocityY = 0
    let isJumping = false
    const groundY = 300
    let score = 0

    const player = new PIXI.Graphics()
    player.beginFill(0x00aaff)
    player.drawRect(0, 0, 50, 50)
    player.endFill()
    player.x = 100
    player.y = groundY
    app.stage.addChild(player)

    const obstacle = new PIXI.Graphics()
    obstacle.beginFill(0xff0000)
    obstacle.drawRect(0, 0, 40, 40)
    obstacle.endFill()
    obstacle.x = 800
    obstacle.y = groundY + 10
    app.stage.addChild(obstacle)

    let time = 0
    let timer = setInterval(() => time++, 1000)

    // Game loop
    app.ticker.add(() => {
      if (isJumping) {
        velocityY += gravity
        player.y += velocityY
        if (player.y >= groundY) {
          player.y = groundY
          isJumping = false
          velocityY = 0
        }
      }

      obstacle.x -= 5
      if (obstacle.x < -50) {
        obstacle.x = 800 + Math.random() * 200
      }

      const hit = checkCollision(player, obstacle)
      if (hit) {
        app.stop()
        clearInterval(timer)
        setGame((g) => ({
          ...g,
          status: 'gameover',
          score: time
        }))
      }
    })

    const onJump = () => {
      if (!isJumping) {
        velocityY = jumpPower
        isJumping = true
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') onJump()
    })

    app.view.addEventListener('click', onJump)

    return () => {
      app.destroy(true, true)
      clearInterval(timer)
      window.removeEventListener('keydown', onJump)
    }
  }, [])

  return <div ref={canvasRef} className="w-full flex justify-center py-8" />
}

function checkCollision(a: PIXI.Graphics, b: PIXI.Graphics) {
  const ab = a.getBounds()
  const bb = b.getBounds()
  return ab.x + ab.width > bb.x &&
         ab.x < bb.x + bb.width &&
         ab.y + ab.height > bb.y &&
         ab.y < bb.y + bb.height
}
