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
        console.log('Showing darker...');
        setTimeout(() => {
            this.ShowSceneById(this.darkerId);
        }, delay || 0);
    }

    HideDarker(delay) {
        console.log('Hiding darker...');
        setTimeout(() => {
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

    HideSceneById(scene_id) {
        let sceneElement = document.getElementById(scene_id);

        let scene = this.scenes[scene_id];
        if (scene && scene.hideAnimation && scene.hideAnimation.duration) {

            /*sceneElement.style.animationDuration = scene.hideAnimation.duration + 'ms';
            sceneElement.classList.add('animated', scene.hideAnimation.name);*/

            $(sceneElement).fadeOut(scene.hideAnimation.duration);

            /*setTimeout(() => {
                this.ForceHideScene(scene_id);
                this.ResetHideAnimationStyles(scene_id);
            }, scene.hideAnimation.duration)*/
        } else {
            this.ForceHideScene(scene_id);
        }
    }

    ShowSceneById(scene_id) {
        let sceneElement = document.getElementById(scene_id);

        // Try to find show animation
        if (this.scenes[scene_id] && this.scenes[scene_id].showAnimation && this.scenes[scene_id].showAnimation.duration) {

            $(sceneElement).fadeIn(this.scenes[scene_id].showAnimation.duration);

            /*sceneElement.style.animationDuration = this.scenes[scene_id].showAnimation.duration + 'ms';
            sceneElement.classList.add('animated', this.scenes[scene_id].showAnimation.name);

            setTimeout(() => {
                this.ResetShowAnimationStyles(scene_id)
            }, this.scenes[scene_id].showAnimation.duration)*/
        } else {
            $(sceneElement).show();
        }
    }
}