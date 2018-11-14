class StoryLoader {
    constructor() {
    }

    static GetUserProgress() {
        let progress = localStorage.getItem('user-progress');
        progress = JSON.parse(progress);
        return progress;
    }

    static CheckUserProgress() {
        let progress = StoryLoader.GetUserProgress();
        if (progress && progress.story && progress.nodes.length > 0) {
            console.info('User has some progress in story ' + progress.story);
            return true;
        } else {
            return false;
        }
    }

    static SaveUserProgress(progress) {
        console.log('Saving user progress...');
        let saveResult = localStorage.setItem('user-progress', JSON.stringify(progress));
        console.log('Saving result: ', saveResult);
    }

    static RemoveUserProgress() {
        localStorage.removeItem('user-progress');
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
        storyLink: 'assets/stories/condition_test.json',
        episodeSubtitle: 'эпизод 1',
        episodeTitle: 'Сквозь звёзды',
        hero: "Скотт Майлз"
    }
];

class Story {
    constructor(sm) {
        this.progress = {
            story: null,
            nodes: [],
            extras: {
                milestone: true
            }
        };
        this.story = null;
        this.sceneManager = sm;
        this.hero = undefined;
    }

    LoadProgress() {
        let progress = StoryLoader.GetUserProgress();
        console.log('User progress: ', progress);

        if (!progress || progress === null || progress === undefined) {
            console.log('Cannot find user progress. Starting from episode 1.');
            this.progress.story = StoryLoader.GetFirstEpisode().story;
        } else {
            this.progress = progress;
            // Initialize extras
            if (!this.progress.extras) {
                this.progress.extras = {}
            }
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

                    this.PreloadStoryFromProgress();
                })
                .catch((error) => {});
        } else {
            console.error('Could not find story pole in user progress!');
        }
    }

    PreloadStoryFromProgress() {
        if (this.progress.nodes && this.progress.nodes.length > 0) {
            let nodes = this.progress.nodes;
            nodes.forEach((p_node, it) => {
                this.LoadStoryNode(p_node, (nodes[it + 1] ? nodes[it + 1] : true)); // second argument is Preload flag
            });
        } else {
            let initialNode = this.story.nodes[this.story.initial_node_index - 1];
            this.LoadStoryNode(initialNode.id);
        }
    }

    LoadStoryNode(node_id, preload) {
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
        // But only in story mode, not preload
        if (!preload) {
            this.sceneManager.ForceShowScene('typing-scene');
            setTimeout(() => {document.getElementById('typing-scene').scrollIntoView({behavior: "smooth"})}, 100);
            setTimeout(() => {
                this.sceneManager.ForceHideScene('typing-scene');
                node = new StoryNode(node, edges, this, author);

                // Update user progress
                // We don't need to change user progress on story preload.
                if (!preload) {
                    console.log("Updating user progress...");

                    if (!this.progress.nodes) {
                        this.progress.nodes = [];
                    }

                    this.progress.nodes.push(node_id);
                    console.log(this.progress);

                    // Save user progress
                    StoryLoader.SaveUserProgress(this.progress);
                }

            }, typingDelay);
        } else {
            // Just show story node
            node = new StoryNode(node, edges, this, author, preload);
        }
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
        this.sceneManager.ShowDarker();
        this.sceneManager.HideDarker(5000);
        this.sceneManager.HideSceneById('intro-scene');
        setTimeout(() => {
            this.sceneManager.ShowSceneById('game-rules');
            setTimeout(() => {
                this.sceneManager.HideSceneById('game-rules');
                this.sceneManager.ShowSceneById('chat');
                setTimeout(() => {this.PreloadStoryFromProgress();}, 2000);
            }, 7000);
        }, 3000);
    }
}

class StoryNode {

    constructor(node, edges, story, author, preload) {
        this.node = node;
        this.story = story;

        let nodeContent = this.node.content;
        if (nodeContent) {
            console.log('Getting actions from node...', nodeContent);
            let parsedContent = ActionCompiler.GetActionFromContent(nodeContent);
            this.actions = parsedContent.actions;
            console.log(this.actions);

            // Update node content with cleared message
            this.node.content = ActionCompiler.CompileVariables(parsedContent.message, StoryNode.ActionCompilerTags);

            // Run all actions before render.
            if (this.actions && !preload) {
                this.RunActions(this.actions);
            }
        }

        // Render edges
        this.edges = new NodeEdges(edges, story, author, preload);

        this.message = this.CreateMessage(this.node.content, (author !== undefined ? author : this.story.hero));
        this.chatNode = this.CreateChatNode();

        // if we don't have message text -> Don't render it.
        if (this.node.content && this.node.content.length > 0) {
            this.PrintMessage();
        }
    }

    RunActions(actions) {
        actions.forEach((actionString) => {
            let act = new ActionCompiler(actionString, StoryNode.ActionCompilerTags);
            act.GetActionCode();
            act.CompileActionCode();
            ActionCompiler.RunAction.bind(this)(act.compiledAction);
        });
    }

    CreateMessage(text, author) {
        let msg = document.createElement('div');
        msg.className = 'message';

        let msgText = document.createElement('div');
        msgText.className = 'message-text';
        msgText.innerHTML = eval('`' + text + '`');


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

StoryNode.ActionCompilerTags = {
    '$STORY': 'this.story',
    '$EXTRAS': 'this.story.progress.extras',
    '$EDGE': 'this.edge'
};

class NodeEdges {
    constructor(edges, story, author, preload) {

        this.answered = !(typeof (preload) !== 'number');
        this.story = story;

        this.replyBox = document.createElement('div');
        this.replyBox.className = 'reply-box animated delay-1s fadeIn' + (typeof (preload) === 'number' ? ' answered' : '');

        this.replies = document.createElement('div');
        this.replies.className = 'replies';

        edges.map(edge => {
            let edgeButton = this.CreateEdgeButton(edge, preload);
            if (edgeButton.innerHTML && edgeButton.innerHTML !== "null" && edgeButton.innerHTML.length > 0) {
                this.replies.appendChild(this.CreateEdgeButton(edge, preload));
            }
        });

        // Add hint if any replies exists.
        if (this.replies.childElementCount > 0) {
            this.hint = document.createElement('div');
            this.hint.className = 'hint';
            let hintTextWaiting = (author !== undefined ? author : this.story.hero.split(' ')[0]) + ' ждёт Вашего ответа';
            let hintTextDone = "Вы ответили";
            this.hint.innerHTML = (typeof (preload) !== 'number' ? hintTextWaiting : hintTextDone);
            this.replyBox.appendChild(this.hint);
        }

        this.replyBox.appendChild(this.replies);
    }

    GetEdges() {
        return this.replyBox;
    }

    CreateEdgeButton(edge, preload) {

        // First start actions
        if (edge) {
            let actions;
            if (edge.content) {
                let parsedContent = ActionCompiler.GetActionFromContent(edge.content);
                actions =  parsedContent.actions;
                console.log('Edge '+edge.id+' actions:');
                console.log(actions);
                edge.content = ActionCompiler.CompileVariables(parsedContent.message, StoryNode.ActionCompilerTags);
            }

            // Run all edges actions.
            if (actions && !preload) {
                this.edge = edge; // Set this edge as current.
                this.RunActions(actions);
            } else {
                console.info("No actions on this edge...");
            }
        }

        let elem = document.createElement('div');
        elem.id = 'edge-' + edge.id;
        elem.className = 'replies--button' + (edge.to_node_id === preload ? ' activated' : '');
        elem.innerHTML = ActionCompiler.EvalVariables.bind(this)(edge.content);
        elem.addEventListener('touchend', () => {
            this.OnReply(elem, edge);
        });

        return elem;
    }

    RunActions(actions) {
        actions.forEach((actionString) => {
            let act = new ActionCompiler(actionString, StoryNode.ActionCompilerTags);
            act.GetActionCode();
            act.CompileActionCode();
            ActionCompiler.RunAction.bind(this)(act.compiledAction);
        });
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