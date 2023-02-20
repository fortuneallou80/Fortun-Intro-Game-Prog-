class StartScene extends Scene {
  update(){
    if(keysDown[" "]){
      SceneManager.changeScene(1)
    }
  }

  draw(ctx){
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, 390, 320);
    ctx.fillStyle = "white";
    ctx.fillText("Welcome to Pong", 145, 130);
    ctx.fillText("Press the Space Key To start the game", 97, 160);
  }
}

class InstructionsScene extends Scene{
  update(){
    if(keysDown["a"]){
      SceneManager.changeScene(2)
    }
  }

  draw(ctx){
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, 390, 320);
    ctx.fillStyle = "yellow";
    ctx.fillText("Instructions on how to play:", 125, 90);
    ctx.fillText("1. Hold the left or right arrow keys to move the paddle back and forth", 40, 140);
    ctx.fillText("2. Press P to pause the game", 120, 160);
    ctx.fillText("3. With the level increasing every 5 points, the paddle gets shorter.", 47, 180);
    ctx.fillText("4. DO NOT DIE!!!!", 145, 200);
    ctx.fillText("PRESS A TO START", 137, 270);
  }
}

class MainScene extends Scene {
  start(){
    this.margin = 137;
    this.size = 140;
  
    this.pongX = this.margin + this.size / 2
    this.pongY = this.margin + this.size / 2
    this.pongVX = 3
    this.pongVY = 2
    this.paddleX = this.margin + this.size / 2
    this.paddleWidth = 40;
    this.points = 0;
    this.level = 1;
  }

  update(){
    //Model of MVC
    this.pongX += this.pongVX
    this.pongY += this.pongVY

    if (this.pongX > this.margin + this.size) {
      this.pongVX *= -1
    }
    if (this.pongY > this.margin + this.size) {
      //Check for a collision with the paddle
      if (this.paddleX - this.paddleWidth / 2 <= this.pongX && this.paddleX + this.paddleWidth / 2 >= this.pongX){
        this.pongVY *= -1
        this.points++}

      else {
        SceneManager.changeScene(3)
      } 
      if (this.points == 5){
          this.level++;
          this.paddleWidth = this.paddleWidth - 7;
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
    if (this.pongX < this.margin) {
      this.pongVX *= -1
    }
    if (this.pongY < this.margin) {
      this.pongVY *= -1
    }

    //Update the paddle based on input
    if (keysDown["ArrowLeft"]) {
      this.paddleX -= 2;
    }
    else if (keysDown["ArrowRight"]) {
      this.paddleX += 2
    }

    //Constrain the paddle position
    if (this.paddleX < this.margin + this.paddleWidth / 2) {
      this.paddleX = this.paddleWidth / 2 + this.margin
    }
    if (this.paddleX > this.margin - this.paddleWidth / 2 + this.size) {
      this.paddleX = -this.paddleWidth / 2 + this.margin + this.size
    }
  }

  draw(){
       //View part of MVC
       ctx.fillStyle = "yellow"
       ctx.fillRect(0, 0, 390, 320);
   
       ctx.strokeStyle = "black"
       ctx.beginPath()
       ctx.moveTo(this.margin, this.margin)
       ctx.lineTo(this.margin + this.size, this.margin)
       ctx.lineTo(this.margin + this.size, this.margin + this.size)
       ctx.moveTo(this.margin, this.margin + this.size)
       ctx.lineTo(this.margin, this.margin)
       ctx.stroke()
   
       //Now draw the paddle
       ctx.beginPath()
       ctx.moveTo(this.paddleX - this.paddleWidth / 2, this.margin + this.size)
       ctx.lineTo(this.paddleX + this.paddleWidth / 2, this.margin + this.size)
       ctx.stroke()
   
       //Creating the ball
       ctx.fillStyle = "red"
   
       ctx.beginPath()
       ctx.arc(this.pongX, this.pongY, 5, 0, Math.PI * 2)
       ctx.fill()
   
       // Level & Points text
       ctx.fillStyle = "red"
       ctx.fillText("Level:", 130, 10);
       ctx.fillText(this.level, 163, 10);
       ctx.fillText("Points:", 200, 10);
       ctx.fillText(this.points, 237, 10);

  }
}

class EndScene extends Scene{
  update(){
    if(keysDown[" "]){
      SceneManager.changeScene(0)
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

SceneManager.addScene(startScene)
SceneManager.addScene(instructionsScene)
SceneManager.addScene(mainScene)
SceneManager.addScene(endScene)
