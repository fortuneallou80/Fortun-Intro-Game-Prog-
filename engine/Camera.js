class Camera extends Component{
    name = "Camera"
    fillStyle;

    constructor(fillStyle = "white"){
        super();
        this.fillStyle = fillStyle;
    }

    static get main(){
        let scene = SceneManager.getActiveScene();
        return scene.gameObjects[0].components[1]
    }
}

window.Camera = Camera;