import "./SceneManager.js"
import "./Component.js"
import "./Scene.js"
import "./GameObject.js"
import "./Transform.js"
import "./Camera.js"
import "./Text.js"
import "./Vector2.js"

let canvas = document.querySelector("#canv")
let ctx = canvas.getContext("2d");

let keysDown = []
let mouseX;
let mouseY
let blinkTimer = 0

//Not the strings has to be all lowercase, e.g. keydown not keyDown or KeyDown
document.addEventListener("keydown", keyDown)
document.addEventListener("keyup", keyUp)

document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
document.addEventListener("mousemove", mouseMove);


//0 is start scene, 1 is instruction scene, 2 main scene, 3 is dead scene
let pause = false

function mouseDown(e) {
  //console.log("mouseDown: " + e.clientX + " " + e.clientY)
}
function mouseUp(e) {
  //console.log("mouseUp: " + e.clientX + " " + e.clientY)
}
function mouseMove(e) {
  //console.log("mouseMove: " + e.clientX + " " + e.clientY)
}


function keyUp(e) {
  keysDown[e.key] = false
  //console.log(e)
  if (e.key == "ArrowLeft") {
    console.log("Up Left")
  }
  if (e.key == "ArrowRight") {
    console.log("Up Right")
  }
  if (e.key == "ArrowUp") {
    console.log("Up Up")
  }
  if (e.key == "ArrowDown") {
    console.log("Up Down")
  }
  if (e.key == "p") {
    pause = !pause
    console.log("p is pressed")
  }
}

function keyDown(e) {
  keysDown[e.key] = true
  //console.log(e)
  if (e.key == "ArrowLeft") {
    console.log("Down Left")
  }
  if (e.key == "ArrowRight") {
    console.log("Down Right")
  }
  if (e.key == "ArrowUp") {
    console.log("Down Up")
  }
  if (e.key == "ArrowDown") {
    console.log("Down Down")
  }
  //To prevent scrolling (if needed)
  //This has to be in keyDown, not keyup
  if (e.key == " ") {
    e.preventDefault()
  }
}

///////////////////////////////////////////////
////////////////// GAME LOOP //////////////////
///////////////////////////////////////////////

function gameLoop() {
  engineUpdate()
  engineDraw()
}

// Update the engine
function engineUpdate() {

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  if (pause) return

  // Reference to the active scene
  let scene = SceneManager.getActiveScene()

  if (SceneManager.changedSceneFlag && scene.start) {
    let camera = scene.gameObjects[0]
    scene.gameObjects = []
    scene.gameObjects.push(camera)

    let previousScene = SceneManager.getPreviousScene()

    if (previousScene) {
      for (let gameObject of previousScene.gameObjects) {
        if (gameObject.markedDoNotDestroyOnLoad) {
          scene.gameObjects.push(gameObject)
        }
      }
    }

    scene.start(ctx)
    SceneManager.changedSceneFlag = false
  }

  for (let gameObject of scene.gameObjects) {
    if (gameObject.start && !gameObject.started) {
      gameObject.start(ctx)
      gameObject.started = true
    }
  }

  for (let gameObject of scene.gameObjects) {
    for (let component of gameObject.components) {
      if (component.start && !component.started) {
        component.start(ctx)
        component.started = true
      }
    }
  }

  //Handle destroy here
  let keptGameObjects = []
  for (let gameObject of scene.gameObjects) {
    if (!gameObject.markedForDestroy) {
      keptGameObjects.push(gameObject)
    }
  }
  scene.gameObjects = keptGameObjects;

  //Call update on all components with an update function
  for (let gameObject of scene.gameObjects) {
    for (let component of gameObject.components) {
      if (component.update) {
        component.update(ctx)
      }
    }
  }
}

let requestedAspectRatio = 16 / 9
let logicalWidth = 1
let letterboxColor = "gray"

function engineDraw() {
  // canvas.width = 390
  // canvas.height = 320

  ctx.fillStyle = Camera.main.fillStyle;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  let browserAspectRatio = canvas.width / canvas.height;
  let offsetX = 0
  let offsetY = 0
  let browserWidth = canvas.width

  if (requestedAspectRatio > browserAspectRatio) {
    let desiredHeight = canvas.width / requestedAspectRatio
    let amount = (canvas.height - desiredHeight) / 2
    offsetY = amount
  }

  else {
    let desiredWidth = canvas.height * requestedAspectRatio
    let amount = (canvas.width - desiredWidth) / 2;
    offsetX = amount;
    browserWidth -= 2 * amount
  }

  let scene = SceneManager.getActiveScene()

  ctx.save()

  let logicalScaling = browserWidth / logicalWidth
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
  ctx.scale(logicalScaling, logicalScaling)

  ctx.translate(-Camera.main.transform.x, -Camera.main.transform.y)

  let min = scene.gameObjects
    .map(go => go.layer)
    .reduce((previous, current) => Math.min(previous, current))

  let max = scene.gameObjects
    .map(go => go.layer)
    .reduce((previous, current) => Math.max(previous, current))
  
  for (let i = min; i <= max; i++) {
    let gameObjects = scene.gameObjects.filter(go => go.layer == i)

    //Draw the components
    for (let gameObject of gameObjects) {
      for (let component of gameObject.components) {
        if (component.draw) {
          component.draw(ctx)
        }
      }
    }
  }

  ctx.restore()

  if (requestedAspectRatio > browserAspectRatio) {
    let desiredHeight = canvas.width / requestedAspectRatio
    let amount = (canvas.height - desiredHeight) / 2
    ctx.fillStyle = letterboxColor
    ctx.fillRect(0, 0, canvas.width, amount);
    ctx.fillRect(0, canvas.height - amount, canvas.width, amount);
    offsetY = amount
  }

  else {
    let desiredWidth = canvas.height * requestedAspectRatio
    let amount = (canvas.width - desiredWidth) / 2
    ctx.fillStyle = letterboxColor
    ctx.fillRect(0, 0, amount, canvas.height);
    ctx.fillRect(canvas.width - amount, 0, amount, canvas.height);
  }
}

function start(title, settings = {}) {

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.title = title

  if (settings) {
    requestedAspectRatio = settings.aspectRatio ?
      settings.aspectRatio : 16 / 9

    letterboxColor = settings.letterboxColor ?
      settings.letterboxColor : "black"

    logicalWidth = settings.logicalWidth ?
      settings.logicalWidth : 100
  }

  setInterval(gameLoop, 1000 / 10)
}

window.start = start;
window.engineUpdate = engineUpdate;
window.engineDraw = engineDraw;
window.keysDown = keysDown;