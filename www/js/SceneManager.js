class SceneManager {
    constructor(scenes_config, darker_id) {
        this.scenes = scenes_config;
        this.darkerId = darker_id || 'dark';
    }

    InitScenes() {
        let scenes = this.scenes;
        for (let sceneId in scenes) {
            console.info('Initializing scene ', sceneId);
            let scene = scenes[sceneId];
            if (scene.visible === false) {
                this.ForceHideScene(scene.id);
            }
        }

        // Now  hide darker.
        this.HideDarker(1200);
    }

    ShowDarker(delay) {
        setTimeout(() => {
            console.log('Showing darker...');
            this.ShowSceneById(this.darkerId);
        }, delay || 0);
    }

    HideDarker(delay) {
        setTimeout(() => {
            console.log('Hiding darker...');
            this.HideSceneById(this.darkerId);
        }, delay || 0);

    }

    ForceHideScene(scene_id, delay) {
        setTimeout(() => {
            let sceneElement = document.getElementById(scene_id);
            $(sceneElement).hide();
        }, delay || 0);
    }

    ForceShowScene(scene_id, delay) {
        setTimeout(() => {
            let sceneElement = document.getElementById(scene_id);
            $(sceneElement).show();
        }, delay || 0);
    }

    HideSceneById(scene_id, delay) {
        let sceneElement = document.getElementById(scene_id);
        let scene = this.scenes[scene_id];
        if (scene && scene.hideAnimation && scene.hideAnimation.duration > 0) {
            setTimeout(() => {
                $(sceneElement).fadeOut(scene.hideAnimation.duration);
            }, delay || 0);
        } else {
            this.ForceHideScene(scene_id, delay);
        }
    }

    ShowSceneById(scene_id, delay) {
        let sceneElement = document.getElementById(scene_id);
        let scene = this.scenes[scene_id];
        // Try to find show animation
        if (scene && scene.showAnimation && scene.showAnimation.duration) {
            setTimeout(() => {
                $(sceneElement).fadeIn(scene.showAnimation.duration);
            }, delay || 0);
        } else {
            this.ForceShowScene(scene_id, delay);
        }
    }
}