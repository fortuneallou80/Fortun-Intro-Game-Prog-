import "../engine/engine.js";

// Scene 0 = Start Scene
// Scene 1 = Main Scene

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
        ctx.font = "4px Courier New";
        ctx.fillText("Press the Space Key to start", -33, 3);
      } else {
        ctx.fillStyle = "#FFD580";
        ctx.fillRect(135, 260, 140, 20);
      }
    }
  }
  
  class StartScene extends Scene {
    constructor() {
      super("#F0FFFF")
    }
  
    start() {
      this.addGameObject(new GameObject("StartControllerGameObject")
        .addComponent(new StartController())
        .addComponent(new Text("Welcome to LIGHTER!", "black", "5px Courier New")), new Vector2(-27, -5))
      Camera.main.parent.addComponent(new StartCameraComponent())
    }
  }

////////////////////////////////////////////////
////////////////// MAIN SCENE //////////////////
////////////////////////////////////////////////

class ColorComponent extends Component {

    constructor(startingTime) {
        super();
        this.time = startingTime
        this.up = true
        this.move = 5
    }

    start() {

    }

    update(movingRight) {
        if (movingRight) {
            this.time += this.move;
            if (this.time >= 255)
                this.time = 255;
        }
        else {
            this.time -= this.move
            if (this.time <= 0) {
                this.time = 0;
            }
        }
    }

    getBackgroundColor() {
        return `rgb(${this.time}, ${this.time}, ${this.time})`;
    }
}

class LighterBallController extends Component {
    name = "LighterBallController"

    constructor() {
        super();
        this.radius = 2;
        this.color = "orange";
        this.speed = 5;
        this.ColorComponent = new ColorComponent(50);
    }

    start() {

    }

    update() {
        if (keysDown["ArrowRight"]) {
            this.transform.x += this.speed;
            this.ColorComponent.update(true);
        }
        if (keysDown["ArrowLeft"]) {
            this.transform.x -= this.speed;
            this.ColorComponent.update(false);
        }
        Camera.main.fillStyle = this.ColorComponent.getBackgroundColor();
    }
}

class LighterBallDrawComponent extends Component {
    constructor(lighterBallController) {
        super();
        this.lighterBallController = lighterBallController;
    }

    draw(ctx) {
        ctx.arc(this.lighterBallController.transform.x, this.lighterBallController.transform.y,
            this.lighterBallController.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.lighterBallController.color;
        ctx.fill();
    }
}

class LighterBallScene extends Scene {
    constructor() {
        super();
    }

    start() {
        const lighterBallController = new LighterBallController();
        this.addGameObject(new GameObject("LighterBallGameObject")
            .addComponent(lighterBallController)
            .addComponent(new LighterBallDrawComponent(lighterBallController)));
    }
}

let startScene = new StartScene()
let lighterBallScene = new LighterBallScene();
window.allScenes = [startScene, lighterBallScene];