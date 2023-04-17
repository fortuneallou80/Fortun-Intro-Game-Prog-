class GameObject{
    name = ""
    components = []
    started = false
    markedForDestroy = false
    markedDoNotDestroyOnLoad = false

    constructor(name){
        this.name = name;
        this.addComponent(new Transform())
    }

    get transform(){
        return this.components[0]
    }

    set transform(t){
        if(!t instanceof Transform){
            throw "Tried to set transfrom to a non-transfrom reference."
        }
        this.components[0] = t;
    }

    addComponent(component){
        this.components.push(component)
        component.parent = this
        return this;
    }

    static getObjectByName(name){
        return SceneManager.getActiveScene().gameObjects.find(gameObject => gameObject.name == name)
    }

    static getObjectsByName(name){
        return SceneManager.getActiveScene().gameObjects.filter(gameObject => gameObject.name == name)
    }

    static find(name){
        return GameObject.getObjectByName(name)
    }

    getComponent(name){
        return this.components.find(c => c.name == name)
    }

    destroy(){
        this.markedForDestroy = true
    }

    doNotDestroyOnLoad(){
        this.markedDoNotDestroyOnLoad = true
    }

    static instantiate(gameObject) {
        SceneManager.getActiveScene().gameObjects.push(gameObject);
        if (gameObject.start && !gameObject.started) {
            gameObject.started = true
            gameObject.start()
        }
    }
}

window.GameObject = GameObject;