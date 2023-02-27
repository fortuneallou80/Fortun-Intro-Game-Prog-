// Scene 0 = Start Scene
// Scene 1 = Instructions Scene
// Scene 2 = Level Scene
// Scene 3 = Main Scene
// Scene 4 = End Scene

class StartScene extends Scene {
  update(){
    if(keysDown[" "]){
      SceneManager.changeScene(1)
    }
  }

  draw(ctx){
    ctx.fillStyle = "#FFD580";
    ctx.fillRect(0, 0, 390, 320);
    ctx.fillStyle = "black";
    ctx.fillText("Welcome to SNAKY!", 145, 130);
    ctx.fillText("Press the Space Key to start the game", 97, 160);
  }
}

class InstructionsScene extends Scene{
  update(){
    if(keysDown["a"]){
      SceneManager.changeScene(2)
    }
  }

  draw(ctx){
    ctx.fillStyle = "#FFD580";
    ctx.fillRect(0, 0, 390, 320);
    ctx.fillStyle = "black";
    ctx.fillText("Instructions on how to play:", 125, 90);
    ctx.fillText("1. Hold the left or right arrow keys to move the paddle back and forth", 40, 140);
    ctx.fillText("2. Press P to pause the game", 120, 160);
    ctx.fillText("3. With the level increasing every 5 points, the paddle gets shorter.", 47, 180);
    ctx.fillText("4. DO NOT DIE!!!!", 145, 200);
    ctx.fillStyle = "red";
    ctx.fillText("PRESS A TO START", 137, 270);
  }
}

class Levels extends Scene {
  level(levelNumber){
    this.level = levelNumber
  }

  start(){
    this.freezeTime = 0
    this.maxFreezeTime = 1
    this.lives = 3;
    this.level(1)
}
  update() {
    this.freezeTime += 50/1000
    if (this.freezeTime >= this.maxFreezeTime) {
        SceneManager.changeScene(3)
    }
}
  draw(ctx){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 390, 320);
    ctx.fillStyle = "white";
    ctx.fillText("LEVEL " + this.level, 170, 140);
    ctx.fillText("LIVES: " + this.lives, 170, 160);
  }

}

class MainScene extends Scene {
  start(){
    // this.margin = 137;
    // this.size = 140;
    this.snakeSize = 25;
    this.snakeX = this.snakeSize * 5;
    this.snakeY = this.snakeSize * 5;
    // this.snakeVX = 0
    // this.snakeVY = 0
    this.food = 3;
    this.speedX = 0;
    this.speedY = 0;
    this.bodySnake = [];
    this.points = 0;
    this.level = 1;
    this.highScore = 0
    this.lives = 3;
  }

  update(){
    //Model of MVC

    if(this.snakeX < 0 || this.snakeX > 14 * this.snakeSize
      || this.snakeY < 0 || this.snakeY > 12 * this.snakeSize){
        SceneManager.changeScene(4)
      }



    if (this.snakeY > this.margin + this.size) {

      // if(this.highScore !== 0){
      //   if (this.points > this.highScore){
      //     localStorage.setItem("this.highScore", this.points)
      //   }
      // }
      // else{
      //   localStorage.setItem("this.highScore", this.points)
      // }

      if (this.points == 2){
        this.level++;
        this.paddleWidth = this.paddleWidth - 7;
        SceneManager.getActiveScene(2);
      }

      if (this.points == 10){
        this.level++;
        this.paddleWidth = this.paddleWidth - 7;
      }

      if (this.points == 15){
        this.level++;
        this.paddleWidth = this.paddleWidth - 7;
      }
    }
    

    // Update the snake based on input
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

  }

  draw(){
    // View part of MVC
    ctx.fillStyle = "#87CEEB"
    ctx.fillRect(0, 0, 390, 320);

    // Creating Snake
    ctx.fillStyle = "red";
    this.snakeX += this.speedX * this.snakeSize;
    this.snakeY += this.speedY * this.snakeSize;
    ctx.fillRect(this.snakeX, this.snakeY, this.snakeSize, this.snakeSize)
   
    // Creating Food
    // ctx.fillStyle = "blue";
    // ctx.fillRect(0, 0, 100, 100)

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
  }
}

class EndScene extends Scene{
  update(){
    if(keysDown[" "]){
      SceneManager.changeScene(2)
    }
  }

  draw(ctx){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 390, 320);
    ctx.fillStyle = "red";
    ctx.fillText("You died", 169, 130);
    ctx.fillText("Press the Space key to try again", 115, 160);
  }
}

let startScene = new StartScene()
let instructionsScene = new InstructionsScene()
let mainScene = new MainScene()
let endScene = new EndScene()
let levels = new Levels()

SceneManager.addScene(startScene)
SceneManager.addScene(instructionsScene)
SceneManager.addScene(levels)
SceneManager.addScene(mainScene)
SceneManager.addScene(endScene)

