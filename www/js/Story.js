class StoryLoader {
    constructor() {
    }

    static GetUserProgress() {
        let progress = localStorage.getItem('user-progress');
        return progress;
    }

    static GetFirstEpisode() {
        return StoryLoader.library[0];
    }

    static GetStoryById(story_id) {
        return StoryLoader.library.filter((story) => story.story === story_id);
    }

    static LoadStory(story_id) {
        return new Promise((resolve, reject) => {
            let story = StoryLoader.GetStoryById(story_id);
            if (story[0]) {
                story = story[0];
                StoryLoader.LoadStoryByUrl(story.storyLink)
                    .then(response => {
                        let project = JSON.parse(response).project;
                        if (project) {
                            let loadedStory = {
                                nodes: project.nodes,
                                edges: project.edges,
                                initial_node_index: project.initial_node_index
                            };
                            resolve(loadedStory);
                        }
                    })
                    .catch(error => {
                        alert('Ошибка при загрузке истории. :(');
                        console.error(error.text);
                        reject({text: error.text});
                    });
            } else {
                console.error('Could not find story to load!');
                reject({text: 'Could not find story to load!'});
            }
        });
    }

    static LoadStoryByUrl(url) {

        console.log('Loading story from ' + url + '.......');

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            // xhr.withCredentials = true;
            xhr.open('GET', url, true);
            xhr.send();

            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) {
                    reject({status: xhr.status, text: xhr.statusText});
                } else {
                    resolve(xhr.response);
                }
            };
        });
    }
}

StoryLoader.library = [
    {
        story: 'astroneer-episode-1',
        storyLink: 'assets/stories/nwre0x2g.json',
        episodeSubtitle: 'эпизод 1',
        episodeTitle: 'Сквозь звёзды',
        hero: "Скотт Майлз"
    }
];

class Story {
    constructor(sm) {
        this.progress = null;
        this.story = null;
        this.sceneManager = sm;
        this.hero;
    }

    LoadProgress() {

        // Show Darker TODO: uncomment
        // this.sceneManager.ShowDarker();

        let progress = StoryLoader.GetUserProgress();
        console.log('User progress: ', progress);

        if (!progress || progress === null || progress === undefined) {
            console.log('Cannot find user progress. Starting from episode 1.');
            this.progress = {
                story: StoryLoader.GetFirstEpisode().story
            };
        } else {
            this.progress = progress;
        }

        // Load json story
        this.LoadStoryFromBranchTrack();
    }

    LoadStoryFromBranchTrack() {
        if (this.progress.story) {
            this.hero = StoryLoader.GetStoryById(this.progress.story)[0].hero;
            StoryLoader.LoadStory(this.progress.story)
                .then((result) => {
                    this.story = result;

                    // Set titles for title-screen.
                    document.getElementById('episode-subtitle').innerHTML = StoryLoader.GetStoryById(this.progress.story)[0].episodeSubtitle;
                    document.getElementById('episode-maintitle').innerHTML = StoryLoader.GetStoryById(this.progress.story)[0].episodeTitle;

                    // TODO: uncomment
                    // this.PlayIntroScenes();

                    this.LoadCurrentStoryNode();
                })
                .catch((error) => {});
        } else {
            console.error('Could not find story pole in user progress!');
        }
    }

    LoadCurrentStoryNode() {
        if (this.progress.storyNode && this.progress.storyNode > 0) {
            this.LoadStoryNode(this.progress.storyNode);
        } else {
            let initialNode = this.story.nodes[this.story.initial_node_index - 1];
            this.progress.storyNode = initialNode.id;
            this.LoadStoryNode(this.progress.storyNode);
        }
    }

    LoadStoryNode(node_id) {
        console.log('Loading next node...');
        let node = this.GetNodeById(node_id)[0];
        if (!node) {
            console.error("Could not find node " + node_id);
            return false;
        }

        console.log(node);
        // Parse feedback
        let typingDelay = 2000;
        let author = undefined;
        if (node.feedback) {
            let feedback = this.ParseFeedback(node.feedback);
            if (feedback) {
                if (feedback.delay) typingDelay = parseInt(feedback.delay) || 2000;
                if (feedback.author) author = feedback.author.toString();
            }
        }

        let edges = this.GetEdgesByIds(node.edges);

        // Show typing scene
        this.sceneManager.ShowSceneById('typing-scene');
        document.getElementById('typing-scene').scrollIntoView({behavior: "smooth"});


        setTimeout(() => {
            this.sceneManager.HideSceneById('typing-scene');
            node = new StoryNode(node, edges, this, author);
        }, typingDelay);
    }

    ParseFeedback(feedback) {
        return JSON.parse(feedback);
    }

    GetNodeById(id) {
        return this.story.nodes.filter((node) => node.id === id);
    }

    GetEdgesByIds(edges_to_find) {
        return this.story.edges.filter(edge => edges_to_find.indexOf(edge.id) >= 0);
    }

    PlayIntroScenes() {
        this.sceneManager.HideDarker(5000);
        this.sceneManager.HideSceneById('intro-scene');
        setTimeout(() => {
            this.sceneManager.ShowSceneById('game-rules');
            setTimeout(() => {
                this.sceneManager.HideSceneById('game-rules');
                setTimeout(() => {this.LoadCurrentStoryNode();}, 2000);
            }, 7000);
        }, 3000);
    }
}

class StoryNode {
    constructor(node, edges, story, author) {
        this.node = node;
        this.story = story;
        this.edges = new NodeEdges(edges, story, author);
        this.message = this.CreateMessage(this.node.content, (author !== undefined ? author : this.story.hero));
        this.chatNode = this.CreateChatNode();
        this.PrintMessage();
    }

    CreateMessage(text, author) {
        let msg = document.createElement('div');
        msg.className = 'message';

        let msgText = document.createElement('div');
        msgText.className = 'message-text';
        msgText.innerHTML = text;

        let msgAuthor = document.createElement('div');
        msgAuthor.className = 'message-author';
        msgAuthor.innerHTML = author;

        msg.appendChild(msgText);
        msg.appendChild(msgAuthor);


        // Append reply box
        msg.appendChild(this.edges.GetEdges());

        return msg;
    }

    CreateChatNode() {
        let chatNode = document.createElement('div');
        chatNode.className = 'chat-node animated fadeIn';
        chatNode.appendChild(this.message);

        return chatNode;
    }

    PrintMessage() {
        let chat = document.getElementById('chat');
        chat.appendChild(this.chatNode);
        $(this.chatNode).scrollintoview();
    }
}

class NodeEdges {
    constructor(edges, story, author) {

        this.answered = false;
        this.story = story;

        this.replyBox = document.createElement('div');
        this.replyBox.className = 'reply-box animated delay-1s fadeIn';

        this.replies = document.createElement('div');
        this.replies.className = 'replies';
        edges.map(edge => {
            this.replies.appendChild(this.CreateEdgeButton(edge));
        });

        // Lets add hint
        this.hint = document.createElement('div');
        this.hint.className = 'hint';
        this.hint.innerHTML = (author !== undefined ? author : this.story.hero.split(' ')[0]) + ' ждёт Вашего ответа';
        this.replyBox.appendChild(this.hint);

        this.replyBox.appendChild(this.replies);
    }

    GetEdges() {
        return this.replyBox;
    }

    CreateEdgeButton(edge) {
        let elem = document.createElement('div');
        elem.id = 'edge-' + edge.id;
        elem.className = 'replies--button';
        elem.innerHTML = edge.content;
        elem.addEventListener('touchend', () => {
            this.OnReply(elem, edge);
        });

        return elem;
    }

    OnReply(button, edge) {
        if (this.answered === false) {
            console.log('Reply registered! Edge:');
            console.log(edge);
            this.answered = true;
            button.classList.add('activated');
            this.replyBox.classList.add('answered');
            this.hint.innerHTML = 'Вы ответили';

            // Load next node
            this.story.LoadStoryNode(edge.to_node_id);
        }
    }
}