import "./SceneManager.js"
import "./Component.js"
import "./Scene.js"
import "./GameObject.js"

let canvas = document.querySelector("#canv")
let ctx = canvas.getContext("2d");

let keysDown = []
let mouseX;
let mouseY

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

// Update the engine
function engineUpdate() {
  if (pause) return

  // Reference to the active scene
  let scene = SceneManager.getActiveScene()

  if (SceneManager.changedSceneFlag && scene.start) {
    scene.gameObjects = []
    SceneManager.changedSceneFlag = false
  }

  for (let gameObject of scene.gameObjects) {
    if (gameObject.start && !gameObject.started) {
      gameObject.start()
      gameObject.started = true
    }
  }

  for (let gameObject of scene.gameObjects) {
    for (let component of gameObject.components) {
      if (component.start && !component.started) {
        component.start()
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
        component.update()
      }
    }
  }

}

function engineDraw() {
  canvas.width = 390
  canvas.height = 320

  let scene = SceneManager.getActiveScene()

  //Draw the components
  for (let gameObject of scene.gameObjects) {
    console.log("gameObject:", gameObject);
    for (let component of gameObject.components) {
      if (component.draw) {
        component.draw(ctx)
      }
    }
  }
}

function start(title) {
  document.title = title

  function gameLoop() {
    engineUpdate()
    engineDraw()
  }

  setInterval(gameLoop, 1000 / 10)
}

window.start = start;