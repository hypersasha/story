
let scenesConfig = {
    "dark": {
        id: 'dark',
        visible: true,
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
            duration: 4000
        }
    },
    "game-loading": {
        visible: false,
        id: 'game-loading',
        hideAnimation: {
            name: 'fadeOut',
            duration: 2000
        }
    },
    "intro-scene": {
        visible: true,
        id: "intro-scene",
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
    },
    "chat": {
        id: 'chat',
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
uiController.OnButtonPressed(startButton, () => {startStory()}, 'pressed');
// uiController.OnButtonReleased(startButton, null, 'pressed');
uiController.OnButtonReleased(resetButton, () => {
    StoryLoader.RemoveUserProgress();
    startButton.innerHTML = 'Начать историю';
    resetButton.style.display = 'none';
});

let vkAuth = new VKAuth();
let story;

StoryLoader.RemoveProgressOnApplicationUpdate();

function startStory() {
    if (!story) {
        story = new Story(sceneManager, vkAuth);
        story.LoadProgress();
    }
}

if (StoryLoader.CheckUserProgress()) {
    startButton.innerHTML = 'Продолжить историю';
} else {
    resetButton.style.display = 'none';
}

// TODO: comment this
// startStory();