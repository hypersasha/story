
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
        visible: true,
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
    },
    "typing-scene": {
        id: "typing-scene",
        visible: false
    }
};

let sceneManager = new SceneManager(scenesConfig);
sceneManager.InitScenes();
// sceneManager.ShowSceneById('intro-scene');

// Getting start button & reset button
let startButton = document.getElementById('start-story');
let resetButton = document.getElementById('reset-progress');

let uiController = new UIController();
uiController.OnButtonPressed(startButton, null, 'pressed');
uiController.OnButtonReleased(startButton, () => {startStory()}, 'pressed');
uiController.OnButtonReleased(resetButton, () => {
    StoryLoader.RemoveUserProgress();
    startButton.innerHTML = 'Начать историю';
    resetButton.style.display = 'none';
});

let story;

function startStory() {
    story = new Story(sceneManager);
    story.LoadProgress();
}

if (StoryLoader.CheckUserProgress()) {
    startButton.innerHTML = 'Продолжить историю';
} else {
    resetButton.style.display = 'none';
}

// startStory();