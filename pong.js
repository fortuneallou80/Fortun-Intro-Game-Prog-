let margin = 20;
let size = 100;


let pongX = margin + size / 2
let pongY = margin + size / 2
let pongVX = 3
let pongVY = 2
let paddleX = margin + size / 2
let paddleWidth = 40;
let points = 0;
let level = 1;


function update() {

  // START GAME SCREEN SCENE 0
  if (scene == 0) {
    if(keysDown[" "]){
      scene = 1;
    }
  }

  // INSTRUCTIONS SCENE 1
  if (scene == 1) {
    if(keysDown["a"]){
      scene = 2;
    }
  }
  else if (scene == 2) {

    //Model of MVC
    pongX += pongVX
    pongY += pongVY

    if (pongX > margin + size) {
      pongVX *= -1
    }
    if (pongY > margin + size) {
      //Check for a collision with the paddle
      if (paddleX - paddleWidth / 2 <= pongX && paddleX + paddleWidth / 2 >= pongX){
        pongVY *= -1
        points++}

      else {
        console.log("You are dead")
        scene = 3;
      } 
      if (points == 10){
          level++;
        }
    }
    if (pongX < margin) {
      pongVX *= -1
    }
    if (pongY < margin) {
      pongVY *= -1
    }

    //Update the paddle based on input
    if (keysDown["ArrowLeft"]) {
      paddleX -= 2;
    }
    else if (keysDown["ArrowRight"]) {
      paddleX += 2
    }

    //Constrain the paddle position
    if (paddleX < margin + paddleWidth / 2) {
      paddleX = paddleWidth / 2 + margin
    }
    if (paddleX > margin - paddleWidth / 2 + size) {
      paddleX = -paddleWidth / 2 + margin + size
    }
  }
  else {
    //Scene 2
    if(keysDown[" "]){
      keysDown[" "] = location.reload();
      scene = 0;
    }
  }
}

function draw() {

  if (scene == 0) {
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, 390, 320);
    ctx.fillStyle = "white";
    ctx.fillText("Welcome to Pong", 145, 130);
    ctx.fillText("Press the Space Key To start the game", 97, 160);
  }

 else if (scene == 1) {
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, 390, 320);
    ctx.fillStyle = "yellow";
    ctx.fillText("Instructions on how to play:", 125, 90);
    ctx.fillText("1. Hold the left or right arrow keys to move the paddle back and forth", 40, 140);
    ctx.fillText("2. Press P to pause the game", 120, 160);
    ctx.fillText("3. The difficulty increases every 10 points earned", 75, 180);
    ctx.fillText("4. DO NOT DIE!!!!", 145, 200);
    ctx.fillText("PRESS A TO START", 137, 270);
  }
  else if (scene == 2) {
    //View part of MVC
    ctx.fillStyle = "yellow"
    ctx.fillRect(0, 0, 390, 320);

    ctx.strokeStyle = "black"
    ctx.beginPath()
    ctx.moveTo(margin, margin)
    ctx.lineTo(margin + size, margin)
    ctx.lineTo(margin + size, margin + size)
    ctx.moveTo(margin, margin + size)
    ctx.lineTo(margin, margin)
    ctx.stroke()

    //Now draw the paddle
    ctx.beginPath()
    ctx.moveTo(paddleX - paddleWidth / 2, margin + size)
    ctx.lineTo(paddleX + paddleWidth / 2, margin + size)
    ctx.stroke()

    ctx.fillStyle = "blue"

    ctx.beginPath()
    ctx.arc(pongX, pongY, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "red"
    ctx.fillText("Level:", 130, 10);
    ctx.fillText(level, 163, 10);
    ctx.fillText("Points:", 200, 10);
    ctx.fillText(points, 237, 10);
  }
  else{
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 390, 320);
    ctx.fillStyle = "red";
    ctx.fillText("You died", 169, 130);
    ctx.fillText("Press the Space key to try again", 115, 160);
  }
}