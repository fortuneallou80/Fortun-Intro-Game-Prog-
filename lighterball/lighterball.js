import "../engine/engine.js";

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

let lighterBallScene = new LighterBallScene();
window.allScenes = [lighterBallScene];