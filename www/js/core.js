
let scenesConfig = {
    "dark": {
        id: 'dark',
        visible: false,
        showAnimation: {
            name: 'fadeIn',
            duration: 3000
        },
        hideAnimation: {
            name: 'fadeOut',
            duration: 2000
        }
    },
    "game-rules": {
        visible: false,
        id: "game-rules",
        showAnimation: {
            name: 'fadeIn',
            duration: 6000
        },
        hideAnimation: {
            name: 'fadeOut',
            duration: 3000
        }
    },
    "intro-scene": {
        visible: false,
        id: "intro-scene",
        showAnimation: {
            name: 'fadeIn',
            duration: 10
        },
        hideAnimation: {
            name: 'fadeOut',
            duration: 2000
        }
    },
    "episode-title": {
        visible: false,
        id: "episode-title",
        showAnimation: {
            name: 'fadeIn',
            duration: 2000
        },
        hideAnimation: {
            name: 'fadeOut',
            duration: 2000
        }
    }
};

let sceneManager = new SceneManager(scenesConfig);
sceneManager.InitScenes();
// sceneManager.ShowSceneById('intro-scene');

// Getting start button
let startButton = document.getElementById('start-story');

let uiController = new UIController();
uiController.OnButtonPressed(startButton, 'pressed');
uiController.OnButtonReleased(startButton, 'pressed', () => {startStory()});

let story;

function startStory() {
    story = new Story(sceneManager);
    story.LoadProgress();
}

startStory();