import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { useRecoilState } from 'recoil'
import beerImageUrl from '../img/beer.svg'
import facebookImageUrl from '../img/facebook.svg'
import instagramImageUrl from '../img/instar.svg'
import sojuImageUrl from '../img/soju.svg'
import humanImageUrl from '../img/uk.svg'
import { gameState } from '../states/gameState'

const GAME_WIDTH = 800
const GAME_HEIGHT = 400
const GROUND_Y = 280
const HUMAN_WIDTH = 50
const HUMAN_HEIGHT = 70
const OBSTACLE_SIZE = 50
const MAX_OBSTACLES = 3
const backgroundImageUrl = `${import.meta.env.BASE_URL}img/bgimgg.svg`
const obstacleImageUrls = [
  facebookImageUrl,
  instagramImageUrl,
  sojuImageUrl,
  beerImageUrl,
]

export default function GameCanvas() {
  const [game, setGame] = useRecoilState(gameState)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (game.status !== 'playing' || !canvasRef.current) return

    const container = canvasRef.current
    const app = new PIXI.Application({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundAlpha: 0,
      antialias: true,
    })
    const canvas = app.view as HTMLCanvasElement
    canvas.className = 'block h-full w-full touch-none object-fill'
    canvas.setAttribute('aria-label', '러너 게임 화면')
    container.replaceChildren(canvas)
    container.focus()

    const background = PIXI.Sprite.from(backgroundImageUrl)
    background.width = GAME_WIDTH
    background.height = GAME_HEIGHT
    app.stage.addChild(background)

    const human = PIXI.Sprite.from(humanImageUrl)
    human.width = HUMAN_WIDTH
    human.height = HUMAN_HEIGHT
    human.position.set(100, GROUND_Y)
    app.stage.addChild(human)

    const obstacles = Array.from({ length: MAX_OBSTACLES }, (_, index) => {
      const imageUrl = obstacleImageUrls[
        Math.floor(Math.random() * obstacleImageUrls.length)
      ]
      const obstacle = PIXI.Sprite.from(imageUrl)
      obstacle.width = OBSTACLE_SIZE
      obstacle.height = OBSTACLE_SIZE
      obstacle.position.set(
        GAME_WIDTH + 300 + index * 260 + Math.random() * 140,
        GROUND_Y + HUMAN_HEIGHT - OBSTACLE_SIZE,
      )
      app.stage.addChild(obstacle)
      return obstacle
    })

    let velocityY = 0
    let jumpCount = 0
    let elapsedMilliseconds = 0
    let displayedSeconds = -1
    let hasEnded = false

    const jump = () => {
      if (hasEnded || jumpCount >= 2) return
      velocityY = -13
      jumpCount += 1
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat) return
      event.preventDefault()
      jump()
    }

    const handlePointerDown = (event: PointerEvent) => {
      event.preventDefault()
      jump()
    }

    window.addEventListener('keydown', handleKeyDown)
    canvas.addEventListener('pointerdown', handlePointerDown)

    app.ticker.add(() => {
      if (hasEnded) return

      const frameScale = app.ticker.deltaMS / (1000 / 60)
      elapsedMilliseconds += app.ticker.deltaMS
      const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000)

      if (elapsedSeconds !== displayedSeconds) {
        displayedSeconds = elapsedSeconds
        setGame((previous) => ({ ...previous, score: elapsedSeconds }))
      }

      if (human.y < GROUND_Y || velocityY < 0) {
        velocityY += 0.7 * frameScale
        human.y = Math.min(GROUND_Y, human.y + velocityY * frameScale)
      } else {
        human.y = GROUND_Y
        velocityY = 0
        jumpCount = 0
      }

      const obstacleSpeed = Math.min(5 + Math.floor(elapsedSeconds / 5), 20)
      for (const obstacle of obstacles) {
        obstacle.x -= obstacleSpeed * frameScale

        if (obstacle.x < -OBSTACLE_SIZE) {
          const farthestX = Math.max(...obstacles.map((item) => item.x))
          obstacle.x = Math.max(GAME_WIDTH, farthestX) + 180 + Math.random() * 220
        }

        const horizontalCollision =
          human.x + HUMAN_WIDTH > obstacle.x + 8 &&
          human.x + 8 < obstacle.x + OBSTACLE_SIZE
        const verticalCollision =
          human.y + HUMAN_HEIGHT > obstacle.y + 8 &&
          human.y + 8 < obstacle.y + OBSTACLE_SIZE

        if (horizontalCollision && verticalCollision) {
          hasEnded = true
          app.ticker.stop()
          setGame((previous) => ({
            ...previous,
            status: 'gameover',
            score: elapsedSeconds,
          }))
          break
        }
      }
    })

    return () => {
      hasEnded = true
      window.removeEventListener('keydown', handleKeyDown)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      app.destroy(true, { children: true, texture: false, baseTexture: false })
    }
  }, [game.status, setGame])

  return (
    <div
      ref={canvasRef}
      className="h-full w-full bg-cover bg-center outline-none"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      tabIndex={0}
    />
  )
}
