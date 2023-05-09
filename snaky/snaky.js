import "../engine/engine.js";

// Scene 0 = Start Scene
// Scene 1 = Instructions Scene
// Scene 2 = Level Scene
// Scene 3 = Main Scene
// Scene 4 = End Scene

////////////////////////////////////////////////
////////////////// START SCENE /////////////////
////////////////////////////////////////////////

class StartCameraComponent extends Component {
  start() {

  }

  update() {
    this.parent.transform.x += 0;
  }
}

class StartController extends Component {
  name = "StartComponent"
  blinkTimer = 0;

  start() {
    this.freezeTime = 0
    this.maxFreezeTime = 1
  }

  update() {
    if (keysDown[" "]) {
      SceneManager.changeScene(1)
    }
  }

  draw(ctx) {
    this.blinkTimer++;
    if (this.blinkTimer % 10 < 5) {
      ctx.fillStyle = "red";
      ctx.font = "4px Arial";
      ctx.fillText("Press the Space Key to start the game", -34, 3);
    } else {
      ctx.fillStyle = "#FFD580";
      ctx.fillRect(135, 260, 140, 20);
    }
  }
}

class StartScene extends Scene {
  constructor() {
    super("#FFD580")
  }

  start() {
    this.addGameObject(new GameObject("StartControllerGameObject")
      .addComponent(new StartController())
      .addComponent(new Text("Welcome to Snaky!", "black", "5px Arial")), new Vector2(-21, -5))
    Camera.main.parent.addComponent(new StartCameraComponent())
  }
}

///////////////////////////////////////////////////////
////////////////// INSTRUCTIONS SCENE /////////////////
///////////////////////////////////////////////////////

class InstructionsController extends Component {
  name = "InstructionsComponent"
  blinkTimer = 0;

  update() {
    if (keysDown["a"]) {
      SceneManager.changeScene(2)
    }
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.font = "3px Arial";
    ctx.fillText("Instructions on how to play:", -17, -28);
    ctx.fillText("1. Use the arrow keys to move the snake around.", -37, -18);
    ctx.fillText("2. Press P to pause the game.", -37, -12);
    ctx.fillText("3. With the level increasing every 10 points, the snake", -37, -6);
    ctx.fillText("moves faster.", -34, 0);
    ctx.fillText("4. DO NOT DIE!!!!", -37, 6);

    this.blinkTimer++;
    if (this.blinkTimer % 10 < 5) {
      ctx.fillStyle = "red";
      ctx.fillText("PRESS A TO START", -13, 25);
    } else {
      ctx.fillStyle = "#FFD580";
      ctx.fillRect(135, 260, 140, 20);
    }
  }
}

class InstructionsScene extends Scene {
  constructor() {
    super("#FFD580")
  }

  start() {
    this.addGameObject(new GameObject("InstructionsControllerGameObject")
      .addComponent(new InstructionsController()))
  }
}

/////////////////////////////////////////////////
////////////////// LEVELS SCENE /////////////////
/////////////////////////////////////////////////

class LevelsController extends Component {
  name = "LevelsComponent"
  level(levelNumber) {
    this.level = levelNumber
  }

  start() {
    this.freezeTime = 0
    this.maxFreezeTime = 1
    this.lives = 3;
    let previousScene = SceneManager.getPreviousScene();
    if (previousScene && previousScene.gameObjectList) {
      this.level = Math.floor((previousScene.gameObjectList[0].getComponent("MainComponent").points - 1) / 5) + 1;
    } else {
      this.level = 1;
    }
  }

  update() {
    this.freezeTime += 50 / 1000
    if (this.freezeTime >= this.maxFreezeTime) {
      SceneManager.changeScene(3)
    }
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.font = "4px Arial";
    ctx.fillText("LEVEL " + this.level, -7, -5);
    ctx.fillText("LIVES: " + this.lives, -7, 3);
  }
}

class LevelsScene extends Scene {
  constructor() {
    super("black")
  }

  start() {
    this.addGameObject(new GameObject("LevelsControllerGameObject")
      .addComponent(new LevelsController()))
  }
}

///////////////////////////////////////////////
////////////////// MAIN SCENE /////////////////
///////////////////////////////////////////////

class MainCameraComponent extends Component {
  start() {

  }

  update() {
    this.transform.x = 50;
    this.transform.y = 41;
  }
}

class MainController extends Component {
  name = "MainComponent"

  start() {
    this.snakeSize = 5;
    this.snakeX = this.snakeSize * 2;
    this.snakeY = this.snakeSize * 2;
    this.foodX;
    this.foodY;
    this.speedX = 0;
    this.speedY = 0;
    this.bodySnake = [
      { x: this.snakeX, y: this.snakeY }, // x and y position of the snake's head
      { x: this.snakeX - this.snakeSize, y: this.snakeY },
      { x: this.snakeX - this.snakeSize * 2, y: this.snakeY },
    ];
    this.points = 0;
    this.level = 1;
    this.highScore = sessionStorage.getItem("highScore")
      ? parseInt(sessionStorage.getItem("highScore")) : 0;
    this.lives = 3;
    this.placeFood();
  }

  placeFood() {
    // Generate food randomly
    this.foodX = Math.floor(Math.random() * 15) * this.snakeSize;
    this.foodY = Math.floor(Math.random() * 13) * this.snakeSize;

    // Check if the new food is on top of the snake
    for (let i = 0; i < this.bodySnake.length; i++) {
      const segment = this.bodySnake[i];
      if (this.foodX === segment.x && this.foodY === segment.y) {
        this.placeFood();
        return;
      }
    }
  }

  generateFood() {
    this.foodX = Math.floor(Math.random() * 15) * this.snakeSize;
    this.foodY = Math.floor(Math.random() * 13) * this.snakeSize;
  }

  update(ctx) {

    // Check if snake collides with the screen
    if (this.snakeX < 0 || this.snakeX >= 93 || this.snakeY < 0
      || this.snakeY >= 76) {
      this.lives -= 1; // Reduce lives by 1 when snake dies
      if (this.lives > 0) {
        this.resetSnake(); // Reset the snake's position and speed if there are still lives left
      } else {
        SceneManager.points = this.points; // Store the points
        SceneManager.changeScene(4); // Change to the end scene if no lives are left
      }
    }

    // Check if snake eats the food
    if (this.snakeX === this.foodX && this.snakeY === this.foodY) {
      this.points++;
      this.generateFood();
      this.bodySnake.push({ x: this.snakeX, y: this.snakeY });
      this.placeFood()
    }

    // Increase point + level
    if (this.points % 10 === 0 && this.points !== 0 && this.points !== this.prevPoints) {
      this.level++;
      this.prevPoints = this.points;
    }

    // Update the snake movement based on input
    if (keysDown["ArrowUp"] && this.speedY != -1) {
      this.speedX = 0;
      this.speedY = -1;
    }
    else if (keysDown["ArrowDown"] && this.speedY != 1) {
      this.speedX = 0;
      this.speedY = 1;
    }
    else if (keysDown["ArrowLeft"] && this.speedX != -1) {
      this.speedX = -1;
      this.speedY = 0;
    }
    else if (keysDown["ArrowRight"] && this.speedX != 1) {
      this.speedX = 1;
      this.speedY = 0;
    }

    // Update the snake's body
    for (let i = this.bodySnake.length - 1; i >= 1; i--) {
      this.bodySnake[i].x = this.bodySnake[i - 1].x;
      this.bodySnake[i].y = this.bodySnake[i - 1].y;
    }

    this.bodySnake[0].x += this.speedX * this.snakeSize;
    this.bodySnake[0].y += this.speedY * this.snakeSize;

    // Take care of High score here
    if (this.points > this.highScore) {
      this.highScore = this.points;
      sessionStorage.setItem("highScore", this.highScore);
    }
  }

  resetSnake() {
    this.snakeX = this.snakeSize * 2;
    this.snakeY = this.snakeSize * 2;
    this.speedX = 0;
    this.speedY = 0;
    this.bodySnake = [
      { x: this.snakeX, y: this.snakeY }, // x and y position of the snake's head
      { x: this.snakeX - this.snakeSize, y: this.snakeY },
      { x: this.snakeX - this.snakeSize * 2, y: this.snakeY },
    ];
  }
}

class MainDrawComponent extends Component {
  constructor(mainController) {
    super();
    this.mainController = mainController;
  }

  draw(ctx) {

    // Creating Snake
    ctx.fillStyle = "green";

    for (let i = 0; i < this.mainController.bodySnake.length; i++) {
      const segment = this.mainController.bodySnake[i];
      ctx.fillRect(segment.x, segment.y, this.mainController.snakeSize,
        this.mainController.snakeSize)
    }

    // Updating position of snake
    this.mainController.snakeX = this.mainController.bodySnake[0].x;
    this.mainController.snakeY = this.mainController.bodySnake[0].y;

    // Level & Points text & Lives
    ctx.fillStyle = "red"
    ctx.font = "4px Arial";
    ctx.fillText("Level:", 2, 5);
    ctx.fillText(this.mainController.level, 14, 5);
    ctx.fillText("Points:", 25, 5);
    ctx.fillText(this.mainController.points, 38, 5);
    ctx.fillText("High Score:", 49, 5);
    ctx.fillText(this.mainController.highScore, 71, 5);
    ctx.fillText("Lives:", 82, 5);
    ctx.fillText(this.mainController.lives, 94, 5);

    // Creating Food
    if (this.mainController.foodX !== undefined && this.mainController.foodY !== undefined) {
      ctx.fillStyle = "blue";
      ctx.fillRect(this.mainController.foodX, this.mainController.foodY,
        this.mainController.snakeSize, this.mainController.snakeSize);
    }
  }
}

class MainScene extends Scene {
  constructor() {
    super("#87CEEB")
  }

  start() {
    const mainController = new MainController()
    this.addGameObject(new GameObject("MainControllerGameObject")
      .addComponent(mainController)
      .addComponent(new MainDrawComponent(mainController)))
    Camera.main.parent.addComponent(new MainCameraComponent())
  }
}

//////////////////////////////////////////////
////////////////// END SCENE /////////////////
//////////////////////////////////////////////

class EndController extends Component {
  update() {
    if (keysDown[" "]) {
      SceneManager.changeScene(2)
    }
  }
}

class EndDrawComponent extends Component {
  draw(ctx) {
    // Get the points
    this.endPoints = SceneManager.points;

    ctx.fillStyle = "red";
    ctx.font = "4px Arial";
    ctx.fillText("You died", -7, -5);
    ctx.fillText("YOUR SCORE: " + this.endPoints, -15, 1);
    ctx.fillText("Press the Space key to try again", -27, 12);
  }
}

class EndScene extends Scene {
  constructor() {
    super("black")
  }

  start() {
    this.addGameObject(new GameObject("EndControllerGameObject")
      .addComponent(new EndController()))
      .addComponent(new EndDrawComponent())
  }
}

let startScene = new StartScene()
let instructionsScene = new InstructionsScene()
let mainScene = new MainScene()
let endScene = new EndScene()
let levelsScene = new LevelsScene()

window.allScenes = [startScene, instructionsScene, levelsScene
  , mainScene, endScene]