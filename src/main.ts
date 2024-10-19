import ECS, { type World } from 'ecs'
import { Keyboard } from './keyboard'
import './style.css'

const app = document.querySelector('#app')!
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')!
canvas.height = innerHeight
canvas.width = innerWidth
app.append(canvas)

// generates a new entity component system
const world = ECS.createWorld()

class Position {
  x: number
  y: number

  constructor({ x, y }: { x?: number, y?: number }) {
    this.x = x || 0
    this.y = y || 0
  }
}

// set up the player
const PLAYER = ECS.createEntity(world)
ECS.addComponentToEntity(
  world, PLAYER, 'position',
  new Position({ x: (canvas.height / 2) - 32, y: canvas.width / 2 })
)

function movementSystem(world: World) {
  const onUpdate = function (dt: number) {
    for (const entity of ECS.getEntities(world, ['position'])) {
      if (Keyboard.keyPressed('KeyW') || Keyboard.keyPressed('ArrowUp'))
        entity.position.y -= 5
      if (Keyboard.keyPressed('KeyS') || Keyboard.keyPressed('ArrowDown'))
        entity.position.y += 5
      if (Keyboard.keyPressed('KeyA') || Keyboard.keyPressed('ArrowLeft'))
        entity.position.x -= 5
      if (Keyboard.keyPressed('KeyD') || Keyboard.keyPressed('ArrowRight'))
        entity.position.x += 5
    }
  }

  return { onUpdate }
}


function rendererSystem(world: World) {
  const RENDERABLE_FILTER = ['renderable']

  // data structure to store all entities that were added or removed last frame
  const result = {
    count: 0,
    entries: new Array(100)
  }

  const onUpdate = function (dt: number) {
    for (const entity of ECS.getEntities(world, ['position']) as { position: Position }[]) {
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
      ctx.strokeStyle = 'tomato'
      ctx.rect(entity.position.x, entity.position.y, 32, 32)
      ctx.stroke()
    }

    // optional 3rd parameter, can be 'added' or 'removed'. populates the list of entities that were
    // added since the last ECS.cleanup(...) call
    ECS.getEntities(world, RENDERABLE_FILTER, 'added', result)
    for (let i = 0; i < result.count; i++)
      console.log('added new entity:', result.entries[i])

    // result will be filled in with a reference to all entries removed last frame
    ECS.getEntities(world, RENDERABLE_FILTER, 'removed', result)
    for (let i = 0; i < result.count; i++)
      console.log('removed entity:', result.entries[i])
  }

  return { onUpdate }
}


ECS.addSystem(world, movementSystem)
ECS.addSystem(world, rendererSystem)

let currentTime = performance.now()

function gameLoop() {
  const newTime = performance.now()
  const frameTime = newTime - currentTime  // in milliseconds, e.g. 16.64356
  currentTime = newTime

  // run onUpdate for all added systems
  ECS.update(world, frameTime)

  // necessary cleanup step at the end of each frame loop
  ECS.cleanup(world)

  requestAnimationFrame(gameLoop)
}


// finally start the game loop
gameLoop()
