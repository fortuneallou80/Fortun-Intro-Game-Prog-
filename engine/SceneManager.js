class SceneManager {
    static scenes = []
    static currentSceneIndex = 0
    static changedSceneFlag = true

    static startScenes(scenes, title){
        SceneManager.setScenes(scenes)
        start(title)
    }
    static setScenes(scenes){
        SceneManager.currentSceneIndex = 0
        SceneManager.changedScene = true
        SceneManager.scenes = []
        SceneManager.addScenes(scenes)
    }
    static addScenes(scenes) {
        for(let scene of scenes){
            SceneManager.addScene(scene)
        }
    }
    static addScene(scene){
        SceneManager.scenes.push(scene)
    }
    static getActiveScene() {
        return SceneManager.scenes[SceneManager.currentSceneIndex];
    }
    static getPreviousScene(){
        if(SceneManager.previousSceneIndex == -1)
        return
    }
    static changeScene(index) {
        SceneManager.currentSceneIndex = index
        SceneManager.changedSceneFlag = true
    }
  }

  window.SceneManager = SceneManager;