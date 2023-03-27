import "../engine/engine.js";

// Scene 0 = Start Scene
// Scene 1 = Instructions Scene
// Scene 2 = Level Scene
// Scene 3 = Main Scene
// Scene 4 = End Scene

////////////////////////////////////////////////
////////////////// START SCENE /////////////////
////////////////////////////////////////////////

class StartController extends Component {
  update() {
    if (keysDown[" "]) {
      SceneManager.changeScene(1)
    }
  }
}

class StartDrawComponent extends Component{
  draw(ctx) {
    ctx.fillStyle = "#FFD580";
    ctx.fillRect(0, 0, 390, 320);
    ctx.fillStyle = "black";
    ctx.fillText("Welcome to SNAKY!", 145, 130);
    ctx.fillText("Press the Space Key to start the game", 97, 160);
  }
}

class StartControllerGameObject extends GameObject{
  start(){
    this.addComponent(new StartController())
  }
}

class StartDrawGameObject extends GameObject{
  start(){
    this.addComponent(new StartDrawComponent())
  }
}

class StartScene extends Scene{
  start(){
    this.addGameObject(new StartControllerGameObject())
    this.addGameObject(new StartDrawGameObject())
  }
}

///////////////////////////////////////////////////////
////////////////// INSTRUCTIONS SCENE /////////////////
///////////////////////////////////////////////////////

class InstructionsController extends Component {
  blinkTimer = 0;
  update() {
    if (keysDown["a"]) {
      SceneManager.changeScene(2)
    }
  }
}

class InstructionsDrawComponent extends Component{
  draw(ctx) {
    ctx.fillStyle = "#FFD580";
    ctx.fillRect(0, 0, 390, 320);
    ctx.fillStyle = "black";
    ctx.fillText("Instructions on how to play:", 125, 90);
    ctx.fillText("1. Hold the left or right arrow keys to move the paddle back and forth", 40, 140);
    ctx.fillText("2. Press P to pause the game", 120, 160);
    ctx.fillText("3. With the level increasing every 5 points, the paddle gets shorter.", 47, 180);
    ctx.fillText("4. DO NOT DIE!!!!", 145, 200);

    this.blinkTimer++;
    if (this.blinkTimer % 10 < 5) {
      ctx.fillStyle = "red";
      ctx.fillText("PRESS A TO START", 137, 270);
    } else {
      ctx.fillStyle = "#FFD580";
      ctx.fillRect(135, 260, 140, 20);
    }
  }
}

class InstructionsControllerGameObject extends GameObject{
  start(){
    this.addComponent(new InstructionsController())
  }
}

class InstructionsDrawGameObject extends GameObject{
  start(){
    this.addComponent(new InstructionsDrawComponent())
  }
}

class InstructionsScene extends Scene {
  start() {
    this.addGameObject(new InstructionsControllerGameObject())
    this.addGameObject(new InstructionsDrawGameObject())
  }
}

/////////////////////////////////////////////////
////////////////// LEVELS SCENE /////////////////
/////////////////////////////////////////////////

class LevelsController extends Component {
  level(levelNumber) {
    this.level = levelNumber
  }

  start() {
    this.freezeTime = 0
    this.maxFreezeTime = 1
    this.lives = 3;
    this.level = 1
  }
  update() {
    this.freezeTime += 50 / 1000
    if (this.freezeTime >= this.maxFreezeTime) {
      SceneManager.changeScene(3)
    }
  }
}

class LevelsDrawComponent extends Component{
  constructor(levelsController) {
    super();
    this.levelsController = levelsController;
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 390, 320);
    ctx.fillStyle = "white";
    ctx.fillText("LEVEL " + this.levelsController.level, 170, 140);
    ctx.fillText("LIVES: " + this.levelsController.lives, 170, 160);
  }
}

class LevelsControllerGameObject extends GameObject {
  start() {
    this.addComponent(new LevelsController())
  }
}

class LevelsDrawGameObject extends GameObject {
  start() {
    const levelsController = SceneManager.getActiveScene().getGameObject("LevelsController").getComponent(LevelsController);
    this.addComponent(new LevelsDrawComponent(levelsController));
  }
}

class LevelsScene extends Scene {
  start() {
      this.addGameObject(new LevelsControllerGameObject())
      this.addGameObject(new LevelsDrawGameObject())
  }
}

///////////////////////////////////////////////
////////////////// MAIN SCENE /////////////////
///////////////////////////////////////////////

class MainController extends Component {
  start() {
    // this.margin = 137;
    // this.size = 140;
    this.snakeSize = 25;
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
    this.highScore = 0
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

  update() {
    //Model of MVC

    // Check if snake collides with the screen
    if (this.snakeX < 0 || this.snakeX > 14 * this.snakeSize
      || this.snakeY < 0 || this.snakeY > 12 * this.snakeSize) {
      SceneManager.changeScene(4)
    }

    // Check if snake eats the food
    if (this.snakeX === this.foodX && this.snakeY === this.foodY) {
      this.points++;
      this.generateFood();
      this.bodySnake.push({ x: this.snakeX, y: this.snakeY });
      this.placeFood()
    }

    if (this.points == 2) {
      // this.level++;
      // SceneManager.getActiveScene(2);
    }

    if (this.points == 10) {
      // this.level++;
    }

    if (this.points == 15) {
      // this.level++;
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

  }
}

class MainDrawComponent extends Component{
  constructor(mainController){
    super();
    this.mainController = mainController;
  }
  
  draw(ctx) {
    // View part of MVC
    ctx.fillStyle = "#87CEEB"
    ctx.fillRect(0, 0, 390, 320);

    // Creating Snake
    ctx.fillStyle = "green";
    for (let i = 0; i < this.bodySnake.length; i++) {
      const segment = this.bodySnake[i];
      ctx.fillRect(segment.x, segment.y, this.snakeSize, this.snakeSize)
    }

    // Updating position of snake
    this.snakeX = this.bodySnake[0].x;
    this.snakeY = this.bodySnake[0].y;

    // Level & Points text & Lives
    ctx.fillStyle = "red"
    ctx.fillText("Level:", 100, 10);
    ctx.fillText(this.level, 133, 10);
    ctx.fillText("Points:", 170, 10);
    ctx.fillText(this.points, 207, 10);
    ctx.fillText("High Score:", 237, 10);
    ctx.fillText(this.highScore, 300, 10);
    ctx.fillText("Lives:", 330, 10);
    ctx.fillText(this.lives, 360, 10);

    // Creating Food
    if (this.foodX !== undefined && this.foodY !== undefined) {
      ctx.fillStyle = "blue";
      ctx.fillRect(this.foodX, this.foodY, this.snakeSize, this.snakeSize);
    }
  }
}

class MainControllerGameObject extends GameObject {
  start() {
    this.addComponent(new MainController());
  }
}

class MainDrawGameObject extends GameObject {
  start() {
    const mainController = SceneManager.getActiveScene().getGameObject("MainController").getComponent(MainController);
    this.addComponent(new MainDrawComponent(mainController));
  }
}

class MainScene extends Scene {
  start() {
    this.addGameObject(new MainControllerGameObject());
    this.addGameObject(new MainDrawGameObject());
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

class EndDrawComponent extends Component{
  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 390, 320);
    ctx.fillStyle = "red";
    ctx.fillText("You died", 169, 130);
    ctx.fillText("Press the Space key to try again", 115, 160);
  }
}

class EndScene extends Scene{
  start(){
    this.addGameObject(new GameObject().addComponent(new EndController()))
    this.addGameObject(new GameObject().addComponent(new EndDrawComponent()))
  }
}

let startScene = new StartScene()
let instructionsScene = new InstructionsScene()
let mainScene = new MainScene()
let endScene = new EndScene()
let levelsScene = new LevelsScene()

window.allScenes = [startScene, instructionsScene, levelsScene, mainScene, endScene]